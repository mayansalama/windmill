import datetime
import json
import logging
import re
import uuid
from abc import ABC, abstractproperty
from copy import deepcopy
from os.path import basename, splitext
from typing import List, Dict, Union

import black
from airflow.models.dag import DAG
from airflow.operators import BaseOperator
from dateutil import parser
from inflection import underscore
from jinja2 import Environment, PackageLoader, select_autoescape
from marshmallow import fields, Schema
from networkx import (
    DiGraph,
    is_directed_acyclic_graph,
    dag_longest_path,
    topological_sort,
    edge_bfs,
)

from ..operators.operator_index import get_operator_index
from ..schemas.app_schemas import DagSchema, OperatorParameterSchema, MinimalWmlSchema
from ...config.project_config import ProjectConfig
from ...constants import GraphConstants
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
    def parameter_list_from_obj(obj: object, param_list: List):
        """Populates value field in a list of dicts matching OperatorParameterSchema
        from an Object, using getattr and hasattr. 

        Values are serialised using JSON

        Arguments:
            obj {object} -- Any object that can use getattr and hasattr (not dicts)
            param_dict {List} -- List of OperatorParameterSchema
        """
        for param in param_list:
            field = param["id"]
            if field == "xcom_push":
                field = "xcom_push_flag"
            if hasattr(obj, field):
                param["value"] = getattr(obj, field)
            elif hasattr(obj, f"_{field}"):
                param["value"] = getattr(obj, f"_{field}")
            else:
                logging.warn(f"Unable to find property {field} in obj {obj}")
            param.update(_op_schema.dump(param))
        return param_list

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
            dt = parser.parse(val)
            return f"{repr(dt)}"
        # TODO datetime.timedelta - regex for cron, presets (e.g. @once), or timedelta parsing
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

        self._snake_name = None

    @property
    def task_id(self):
        return self.params["task_id"]["value"]

    @property
    def snake_name(self):
        """snakecase version of task_params["task_id"]. Python 
        variable names can't start with a number
        
        Returns:
            [str]: task_name
        """
        if not self._snake_name:
            name = underscore(self.task_id.replace(" ", "_"))
            name = re.sub("[^0-9a-zA-Z_]", "", name)
            name = re.sub("^[^a-zA-Z_]+", "", name)

            return name
        return self._snake_name

    @snake_name.setter
    def snake_name(self, val):
        self._snake_name = val

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

        # DAG is populated by Jinja template
        if "dag" in task_params:
            task_params.pop("dag")

        if not task_params.get("task_id"):
            raise DagHandlerValidationError(
                f"Node {node_id} missing required parameter task_id"
            )

        return TaskHandler(node_id, operator_type, module, task_params)

    @classmethod
    def load_from_task(cls, task: BaseOperator):
        """Creates a TaskHandler from an Airflow Task

        Arguments:
            task {BaseOperator} -- Instantiated Operator
        
        Returns:
            [TaskHandler]: The converted TaskHandler object
        """
        task_dict = get_operator_index().marshall_operator(task.__class__)
        task_dict["id"] = str(uuid.uuid4())

        # Populate values in parameters list
        cls.parameter_list_from_obj(task, task_dict["properties"]["parameters"])
        return cls.load_from_node(task_dict)

    def to_app_schema(self, x=0, y=0):
        """Convert into NodeSchema

        Keyword Arguments:
            x {int} --  x coordinate (default: {0})
            y {int} --  y coordinate (default: {0})

        Returns:
            Dict -- JSON dict matching NodeSchema
        """
        op_index = get_operator_index()
        for operator in op_index.marshalled_operators:
            # FIXME Validate module?
            if operator["type"] == self.operator_type:
                properties_dict = deepcopy(operator["properties"])
                for parameter in properties_dict["parameters"]:
                    field = parameter["id"]
                    if field in self.params:
                        parameter["value"] = self.params[field]["value"]
                properties_dict["name"] = self.params["task_id"]["value"]
                return {
                    "id": self.node_id,
                    "position": {"x": x, "y": y},
                    "properties": properties_dict,
                    "type": self.operator_type,
                }

        raise DagHandlerValidationError(
            f"Unable to find operator class task {self.operator_type}"
        )


class Links:
    def __init__(self, graph, task_name_mappings):
        """Metadata describing the links in a DAG between tasks
        
        Args:
            link_graph (Digraph): Networkx Digraph object describing nodes and edges
        """
        self.graph = graph
        self.task_name_mappings = task_name_mappings

    @property
    def node_ids(self):
        return set(self.graph.nodes)

    @property
    def paths(self):
        return self.get_bitshift_paths()

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
                graph.add_edge(from_dict["nodeId"], to_dict["nodeId"])
            except KeyError as e:
                raise DagHandlerValidationError(
                    f"Unable to find node(s) [{e}] referenced by links"
                )

        if not is_directed_acyclic_graph(graph):
            raise DagHandlerValidationError("Links do not form a valid DAG")

        return Links(graph, task_name_mappings)

    @staticmethod
    def graph_to_efficient_representation(graph):  # r to ignore Wd1401
        r"""Greedy algorithm to find an efficient representation of a graph 

        A Graph that looks like: 

            1 -> 2 -> 4 -> 5-> -->6
              -> 3 ---------- /
                 \ -> 7

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
        return [
            " >> ".join([self.task_name_mappings.get(n, n) for n in path])
            for path in paths
            if len(path) > 1
        ]

    @staticmethod
    def graph_to_coords(g):
        """Topologically sorts graph and returns a Dict of structure:
        nodeId: {x: , y: }

        Note Nodes will be spaced such that the gap between nodes is a multiple 
        of height/width. This constant is defined in GraphConstants.NODE_SPACING_FACTOR

        Graphs are sorted downwards, and nodes are centre justitifed, like this
            1
        2   3   4
          5   6
            7
        """
        levels = []
        for node in topological_sort(g):
            upstream_nodes = list(edge_bfs(g, node, orientation="reverse"))
            ind = 0
            for up_node, _, _ in upstream_nodes:
                for level_index, level in enumerate(levels):
                    if up_node in level:
                        ind = max(ind, level_index + 1)
            if len(levels) < ind + 1:
                levels.append([node])
            else:
                levels[ind].append(node)
        max_width = max([len(l) for l in levels])

        dx = GraphConstants.NODE_WIDTH
        dy = GraphConstants.NODE_HEIGHT
        s = GraphConstants.NODE_SPACING_FACTOR
        nodes = {}
        for l_index, level in enumerate(levels):
            spacing = (max_width + 1) / (len(level) + 1)
            for n_index, node in enumerate(level):
                nodes[node] = {
                    "x": (n_index + 1) * spacing * dx * s,
                    "y": (l_index + 1) * dy * s,
                }
        return nodes

    def to_app_schema(self):
        """Return a Dict of the same structure as LinkSchema
        """
        links = {}
        for u, v in self.graph.edges:
            link_id = str(uuid.uuid4())
            links[link_id] = {
                "id": link_id,
                "from_node": {"nodeId": u, "portId": "out_port"},
                "to_node": {"nodeId": v, "portId": "in_port"},
            }
        return links

    def to_coords(self):
        return self.graph_to_coords(self.graph)


class DagHandler(_ParamHandler):

    docstring_parser = ClassParser()
    env = Environment(
        loader=PackageLoader("windmill", "templates"),
        autoescape=select_autoescape(enabled_extensions=["j2"]),
    )

    def __init__(
        self, dag_params: dict, tasks: List[TaskHandler], links: Links, filename: str
    ):
        """Handler to manage conversions between WMLs and Python DAGs. Should be 
        generated using DagHandler.load_from_wml
        
        Args:
            dag_params (dict): Dictionary of DAG parameters
            tasks (List[TaskHandler]): List of tasks metadata
            links (Links): Object describing links between tasks
            filename (Links): Name of the source file (with no extension)
        
        Raises:
            DagHandlerValidationError: Raised if WML can't be converted into a valid DAG instance
        """
        self.params = dag_params
        self.tasks = tasks
        self.links = links
        self.filename = filename

    @property
    def dag_id(self):
        return self.params["dag_id"]["value"]

    @property
    def snake_name(self):
        """snakecase version of task_params["dag_id"]
        
        Returns:
            [str]: dag_name
        """
        return underscore(self.dag_id.replace(" ", "_"))

    @classmethod
    def fix_task_names(self, dag_id, tasks: List[TaskHandler]):
        """Task IDs are enforced as unique (as of AF 2.0) but when
        converting to python vars there's potential for clashes.

        Although they're somewhat allowed in AF1.0, this will raise 
        an error if duplicate task names are 
         
        Arguments:
            dag_id {str}              -- Name of the dag
            tasks {List[TaskHandler]} -- Task handlers to dedupe

        Raises:
            DagHandlerValidationError: On duplicated task ids
        """
        task_ids = [t.task_id for t in tasks]
        if len(task_ids) != len(set(task_ids)):
            raise DagHandlerValidationError("DAGs cannot have duplicate task IDs")

        snake_names = [dag_id]
        for task in tasks:
            if task.snake_name in snake_names:
                basename = task.snake_name
                ind = 0
                name = f"{basename}_{ind}"
                while name in snake_names:
                    ind += 1
                    name = f"{basename}_{ind}"
                snake_names.append(name)
                task.snake_name = name
            else:
                snake_names.append(task.task_id)
        return tasks

    @classmethod
    def marshall_dag_docstring(cls):
        return DagSchema().dump(cls.docstring_parser.parse_class(DAG)[1])

    @classmethod
    def load_from_wml(cls, wml_dict):
        """Returns a validated DagHandler from a Wml Dict
        
        Args:
            wml_dict (dict): Dict matching MinimalWmlSchema
        
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
        tasks = cls.fix_task_names(dag_params["dag_id"], tasks)
        task_name_mappings = {t.node_id: t.snake_name for t in tasks}
        links = Links.load_from_links(wml_dict["links"].values(), task_name_mappings)

        return DagHandler(dag_params, tasks, links, wml_dict["filename"])

    def to_wml(self) -> Dict:
        """Render DagHandler as a WML dict

        Returns:
            [Dict] -- Dict matching MinimalWmlSchema 
        """
        dag_dict = self.marshall_dag_docstring()
        for parameter in dag_dict["parameters"]:
            field = parameter["id"]
            if field in self.params:
                parameter["value"] = self.params[field]["value"]
        dag_dict["name"] = self.dag_id

        if len(self.links.graph):
            links = self.links.to_app_schema()
            coords = self.links.to_coords()
            nodes = {
                t.node_id: t.to_app_schema(**coords[t.node_id]) for t in self.tasks
            }
        else:
            links = {}
            nodes = {t.node_id: t.to_app_schema() for t in self.tasks}

        wml = {
            "filename": self.filename,
            "dag": dag_dict,
            "links": links,
            "nodes": nodes,
        }
        return MinimalWmlSchema().dump(wml)

    @property
    def callable_tasks(self):
        return [task for task in self.tasks if task.python_callable]

    @classmethod
    def load_from_dag(cls, dag: DAG):
        dag_dict = cls.marshall_dag_docstring()
        dag_params = cls.parameter_list_to_dict(
            cls.parameter_list_from_obj(dag, dag_dict["parameters"])
        )

        # TODO: Remove values if mastered in dag (e.g. start_date, default args)
        tasks = [TaskHandler.load_from_task(task) for task in dag.task_dict.values()]
        tasks = cls.fix_task_names(dag_params["dag_id"], tasks)
        task_id_to_node_id = {task.task_id: task.node_id for task in tasks}

        task_name_mappings = {t.node_id: t.snake_name for t in tasks}
        graph = DiGraph()
        for task_id, task in dag.task_dict.items():
            for upstream_task_id in task.downstream_task_ids:
                graph.add_edge(
                    task_id_to_node_id[task_id], task_id_to_node_id[upstream_task_id]
                )

        links = Links(graph, task_name_mappings)

        return DagHandler(dag_params, tasks, links, splitext(basename(dag.fileloc))[0])

    def to_python(self):
        """Renders the Dag Instance as Python Code:
        - Python generated using Jinja template
        - Formatted using Black
        - Import from str to validate generated py code

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


class DagFileHandler:
    def __init__(self, pyfile: str, config: ProjectConfig):
        self.pyfile = pyfile
        self.conf = config

        self.mod = import_dag_from_project(pyfile, config)

    @property
    def dag(self):
        dags = {k: v for k, v in self.mod.__dict__.items() if type(v) == DAG}
        if len(dags) != 1:
            raise DagHandlerValidationError(
                f"Importing from Python only supports files with exactly one dag object. Found the following dags: {','.join(dags.keys())}"
            )
        return dags.popitem()[1]

    @property
    def wml(self):
        return DagHandler.load_from_dag(self.dag).to_wml()
