from abc import ABC, abstractproperty
from copy import deepcopy
from typing import List, Dict

import black
from airflow.models.dag import DAG
from inflection import underscore
from jinja2 import Environment, PackageLoader, select_autoescape
from marshmallow import Schema, fields
from networkx import DiGraph, is_directed_acyclic_graph, dag_longest_path

from ..schemas.app_schemas import DagSchema, OperatorParameterSchema
from ...config.project_config import ProjectConfig
from ...exceptions import DagHandlerValidationError
from ...utils.class_parser import ClassParser
from ...utils.import_handler import import_str_as_module, import_dag_from_project

_op_schema = OperatorParameterSchema()


class _ParamHandler(ABC):
    def __init__(self, params):
        """Helper class to deal with parameter rendering
        """
        self.params = params

    @abstractproperty
    def snake_name(self):
        raise NotImplementedError("Must be implemented")

    @staticmethod
    def parameter_list_to_dict(params):
        """Validates a list of App Parameters and returns a dict of parameter keys and values
        
        Args:
            params (list): List of Parameters matching OperatorParameterSchema

        Raises:
            DagHandlerValidationError: If a required parameter doesn't have a value
        
        Returns:
            [dict]: Mapping between non-default fields and values
        """
        params = [_op_schema.load(param) for param in params]
        for param in params:
            if param.get("required", False) and param.get("value") == None:
                raise DagHandlerValidationError(
                    f"'{param['id']}' is a required parameter'"
                )
        return {
            param["id"]: param
            for param in params
            if param.get("value") and param["value"] != param.get("default")
        }

    def param_to_callable(self, param_name):
        return f"{self.snake_name}_{underscore(param_name)}_callable"

    @staticmethod
    def render_non_callable_for_jinja(value_dict: Dict) -> str:
        """Renders values according to datatypes

        Arguments:
            value_dict {Dict} -- OperatorParameterSchema

        Returns:
            str -- String to be rendered by Jinja
        """
        typ = value_dict["type"]
        val = value_dict["value"]

        if typ == "str":
            return "'" + val.replace("'", "''") + "'"
        elif typ == "datetime.datetime":
            return f"parser.parse('{val}')"
        # elif typ == "datetime.timedelta":
        # TODO regex for cron, presets (e.g. @once), or timedelta parsing
        else:  # default to str
            return str(val)

    @property
    def callables(self):
        return {
            k: {"method": v["value"], "name": self.param_to_callable(k)}
            for k, v in self.params.items()
            if v["type"] == "python_callable"
        }

    @property
    def params_to_kwargs(self):
        """Converts task parameters into a valid kwargs expression
        """
        non_callables = [
            f"{k} = {self.render_non_callable_for_jinja(v)}"
            for k, v in self.params.items()
            if k not in self.callables
        ]
        params = ", ".join(
            non_callables
            + [f"{k} = {self.param_to_callable(k)}" for k in self.callables]
        )
        return params


class TaskHandler(_ParamHandler):
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
        self.params = task_params

    @property
    def snake_name(self):
        """snakecase version of task_params["task_id"]
        
        Returns:
            [str]: task_name
        """
        return underscore(self.params["task_id"]["value"])

    @classmethod
    def load_from_node(cls, node_dict):
        """Creates a TaskHandler from a WML Node Dictionary
        
        Args:
            node_dict (dict): Dictionary that matches app_schemas.NodeSchema
        
        Returns:
            [TaskHandler]: The converted TaskHandler object
        """
        node_id = node_dict["id"]
        operator_type = node_dict["type"]
        module = node_dict["properties"]["module"]
        task_params = cls.parameter_list_to_dict(node_dict["properties"]["parameters"])

        if not task_params.get("task_id"):
            raise DagHandlerValidationError(
                f"Node {node_id} missing required parameter task_id"
            )

        return TaskHandler(node_id, operator_type, module, task_params)


class Links:
    def __init__(self, graph):
        """Metadata describing the links in a DAG between tasks
        
        Args:
            link_graph (Digraph): Networkx Digraph object describing nodes and edges
        """
        self.graph = graph
        self.paths = self.get_bitshift_paths()

    @property
    def node_ids(self):
        return set(self.graph.nodes)

    @staticmethod
    def load_from_links(links, task_name_mappings):
        """Converts a Links Dictionary into a Links object
        
        Args:
            links (list): List of Link descriptions matching app_schemas.LinkSchema
            task_name_mappings (dict): Mapping from node ID to task name
        
        Raises:
            DagHandlerValidationError: Raised if the resulting graph is not a valid DAG
        
        Returns:
            Links: Instantiated DAG object
        """

        graph = DiGraph()
        for link_dict in links:
            try:
                # Link goes from out nodes to in node
                # Front end flow chart allows link to start at our in node
                if link_dict["from_node"]["portId"] == "out_port":
                    from_dict = link_dict["from_node"]
                    to_dict = link_dict["to_node"]
                else:
                    from_dict = link_dict["to_node"]
                    to_dict = link_dict["from_node"]
                graph.add_edge(
                    task_name_mappings[from_dict["nodeId"]],
                    task_name_mappings[to_dict["nodeId"]],
                )
            except KeyError as e:
                raise DagHandlerValidationError(
                    f"Unable to find node(s) [{e}] referenced by links"
                )

        if not is_directed_acyclic_graph(graph):
            raise DagHandlerValidationError("Links do not form a valid DAG")

        return Links(graph)

    @staticmethod
    def graph_to_efficient_representation(graph):
        """Greedy algorithm to find an efficient representation of a graph

        A Graph that looks like: 

            1 -> 2 -> 4 -> 5-> -->6
              -> 3 -------------|
                 \-> 7

        Will go to:
        [1, 2, 4, 5, 6]
        [1, 3, 7]
        [3, 6]
        """
        G = deepcopy(graph)
        paths = []
        while len(G.edges()) > 0:
            longest_path = dag_longest_path(G)
            paths.append(longest_path)
            edges = list(zip(longest_path[:-1], longest_path[1:]))

            for edge in edges:
                G.remove_edge(*edge)
        return paths

    def get_bitshift_paths(self):
        paths = self.graph_to_efficient_representation(self.graph)
        return [" >> ".join(path) for path in paths if len(path) > 1]


class DagHandler(_ParamHandler):

    docstring_parser = ClassParser()
    env = Environment(
        loader=PackageLoader("windmill", "templates"),
        autoescape=select_autoescape(enabled_extensions=["j2"]),
    )

    def __init__(self, dag_params: dict, tasks: List[TaskHandler], links: Links):
        """Handler to manage conversions between WMLs and Python DAGs. Should be 
        generated using DagHandler.load_from_wml
        
        Args:
            dag_params (dict): Dictionary of DAG parameters
            tasks (List[TaskHandler]): List of tasks metadata
            links (Links): Object describing links between tasks
        
        Raises:
            DagHandlerValidationError: Raised if WML can't be converted into a valid DAG instance
        """
        self.params = dag_params
        self.tasks = tasks
        self.links = links

    @property
    def snake_name(self):
        """snakecase version of task_params["dag_id"]
        
        Returns:
            [str]: dag_name
        """
        return underscore(self.params["dag_id"]["value"])

    @classmethod
    def marshall_dag_docstring(cls):
        return DagSchema().dump(cls.docstring_parser.parse_class(DAG)[1])

    @classmethod
    def load_from_wml(cls, wml_dict):
        """Returns a validated DagHandler from a Wml Dict
        
        Args:
            wml_dict (dict): Full WML file converted to a Dict
        
        Raises:
            DagHandlerValidationError: If instance params are invalid

        Returns:
            [DagHandler]: The converted DagHandler object
        """
        dag_params = cls.parameter_list_to_dict(wml_dict["dag"]["parameters"])
        if not dag_params.get("dag_id"):
            raise DagHandlerValidationError(f"DAG is missing required parameter dag_id")

        tasks = [
            TaskHandler.load_from_node(node) for node in wml_dict["nodes"].values()
        ]
        task_name_mappings = {t.node_id: t.snake_name for t in tasks}
        links = Links.load_from_links(wml_dict["links"].values(), task_name_mappings)

        return DagHandler(dag_params, tasks, links)

    @property
    def callable_tasks(self):
        return [task for task in self.tasks if task.python_callable]

    def compile_to_python(self):
        """Compiles the Dag Instance into Python Code:
        - Python generated using Jinja template
        - Formatted using Black
        - Validated using Airflow by attempting an import
        
        Returns:
            [str]: The formatted DAG 
        """
        template = self.env.get_template("dag.j2")
        res = template.render(dag=self)
        py_code = black.format_str(res, line_length=80)

        try:
            import_str_as_module(py_code, "wml_dag")
        except Exception as e:
            raise DagHandlerValidationError(f"Rendered dag is invalid: {str(e)}") from e

        return py_code

    @classmethod
    def load_from_dag(cls, dag_object):
        pass


class DagFileHandler:
    def __init__(self, pyfile: str, config: ProjectConfig):
        self.pyfile = pyfile
        self.conf = config

        self.mod = import_dag_from_project(pyfile, config)

    @property
    def dags(self):
        return [v for v in self.mod.__dict__.values() if type(v) == DAG]
