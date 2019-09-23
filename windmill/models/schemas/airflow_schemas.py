from typing import List

from marshmallow import Schema, fields
from networkx import DiGraph, is_directed_acyclic_graph

from .app_schemas import OperatorParameterSchema
from ...exceptions import DagInstanceValidationError

_op_schema = OperatorParameterSchema()


def _parameter_list_to_dict(params):
    """Validates a list of App Parameters and returns a dict of parameter keys and values
    
    Args:
        params (list): List of Parameters matching OperatorParameterSchema

    Raises:
        DagInstanceValidationError: If a required parameter doesn't have a value
    
    Returns:
        [dict]: Mapping between non-default fields and values
    """
    params = [_op_schema.load(param) for param in params]
    for param in params:
        if param.get("required", False) and param.get("value") == None:
            raise DagInstanceValidationError(
                f"'{param['id']}' is a required parameter'"
            )
    return {
        param["id"]: param["value"]
        for param in params
        if param.get("value") and param["value"] != param.get("default")
    }


class TaskInstance:
    def __init__(self, node_id, operator_type, module, task_params):
        """Schema for a Task Instance, that can be loaded from an App Node object
        
        Args:
            node_id (str): Internal Node ID used by LinkInstances
            operator_type (str): Name of the operator class
            module (str): Module path to import operator
            task_params (dict): List of Task Parameters
        """
        self.node_id = node_id
        self.operator_type = operator_type
        self.module = module
        self.task_params = task_params

    @staticmethod
    def load_from_node(node_dict):
        """Creates a TaskInstance from a WML Node Dictionary
        
        Args:
            node_dict (dict): Dictionary that matches app_schemas.NodeSchema
        
        Returns:
            [TaskInstance]: The converted TaskInstance object
        """
        node_id = node_dict["id"]
        operator_type = node_dict["type"]
        module = node_dict["properties"]["module"]
        task_params = _parameter_list_to_dict(node_dict["properties"]["parameters"])

        return TaskInstance(node_id, operator_type, module, task_params)


class LinksInstance:
    def __init__(self, graph):
        """Metadata describing the links in a DAG between tasks
        
        Args:
            link_graph (Digraph): Networkx Digraph object describing nodes and edges
        """
        self.graph = graph

    @property
    def node_ids(self):
        return set(self.graph.nodes)

    @staticmethod
    def load_from_links(links):
        """Converts a Links Dictionary into a LinksInstance object
        
        Args:
            links (list): List of Link descriptions matching app_schemas.LinkSchema
        
        Raises:
            DagInstanceValidationError: Raised if the resulting graph is not a valid DAG
        
        Returns:
            LinksInstance: Instantiated DAG object
        """
        graph = DiGraph()
        for link_dict in links:
            graph.add_edge(
                link_dict["from_node"]["nodeId"], link_dict["to_node"]["nodeId"]
            )
        if not is_directed_acyclic_graph(graph):
            raise DagInstanceValidationError("Links do not form a valid DAG")
        return LinksInstance(graph)


class DagInstance:
    def __init__(
        self, dag_params: dict, tasks: List[TaskInstance], links: LinksInstance
    ):
        """Schema to store all metadata to build a valid Python DAG from a WML
        file. Should be generated using DagInstance.load_from_wml
        
        Args:
            dag_params (dict): Dictionary of DAG parameters
            tasks (List[TaskInstance]): List of tasks metadata
            links (LinksInstance): Object describing links between tasks
        
        Raises:
            DagInstanceValidationError: Raised if WML can't be converted into a valid DAG instance
        """
        self.dag_params = dag_params
        self.tasks = tasks
        self.links = links

    @staticmethod
    def load_from_wml(wml_dict):
        """Returns a validated DagInstance from a Wml Dict
        
        Args:
            wml_dict (dict): Full WML file converted to a Dict
        
        Raises:
            DagInstanceValidationError: If instance params are invalid

        Returns:
            [DagInstance]: The converted DagInstance object
        """
        dag_params = _parameter_list_to_dict(wml_dict["dag"]["parameters"])
        tasks = [
            TaskInstance.load_from_node(node) for node in wml_dict["nodes"].values()
        ]
        links = LinksInstance.load_from_links(wml_dict["links"].values())

        # Assert that link ids are valid
        link_ids = links.node_ids
        node_ids = {t.node_id for t in tasks}
        missing_nodes = link_ids - node_ids
        if missing_nodes:
            raise DagInstanceValidationError(
                f"Unable to find node(s) `{missing_nodes}` referenced by links"
            )

        return DagInstance(dag_params, tasks, links)
