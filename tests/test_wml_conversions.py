import json
from copy import deepcopy
from unittest import TestCase

import networkx as nx
from marshmallow import EXCLUDE

from windmill.exceptions import DagHandlerValidationError
from windmill.models.schemas.app_schemas import MinimalWmlSchema
from windmill.models.dags.dag_handler import DagHandler, TaskHandler, Links

from . import test_datafiles


class Fixture(TestCase):
    def setUp(self):
        self.valid_py = test_datafiles["Valid.py"]

        self.valid_wml = json.loads(test_datafiles["Valid.wml"])
        self.valid_wml_dict = MinimalWmlSchema().load(
            self.valid_wml, partial=False, unknown=EXCLUDE
        )

        return super().setUp()


class TestWmlMarshalling(Fixture):
    def test_valid_wml_is_marshallable(self):
        valid_wml_dict = MinimalWmlSchema().load(
            self.valid_wml, partial=False, unknown=EXCLUDE
        )
        assert valid_wml_dict["filename"] == "Valid"

    def test_wml_conversion_to_python(self):
        dag_handler = DagHandler.load_from_wml(self.valid_wml_dict)
        res = dag_handler.compile_to_python()
        print(res)
        assert res.strip() == self.valid_py.strip()

    def test_link_bitshift_conversions(self):
        # This example is defined in the graph_to_efficient_representation docs
        G = nx.DiGraph()
        G.add_edge(1, 2)
        G.add_edge(1, 3)
        G.add_edge(2, 4)
        G.add_edge(3, 6)
        G.add_edge(3, 7)
        G.add_edge(4, 5)
        G.add_edge(5, 6)

        paths = Links.graph_to_efficient_representation(G)
        assert paths == [[1, 2, 4, 5, 6], [1, 3, 7], [3, 6]]


class TestTaskMarshalling(Fixture):
    def test_task_marshall_from_node(self):
        nodes: dict = self.valid_wml_dict["nodes"]
        node = nodes.popitem()[1]
        ti = TaskHandler.load_from_node(node)

        assert ti.module == "airflow.operators.bash_operator"
        assert ti.operator_type == "BashOperator"
        assert list(ti.params.keys()) == ["bash_command", "task_id"]

    def test_task_marshall_from_node_fails_on_missing_required_param(self):
        node = deepcopy(self.valid_wml_dict["nodes"].popitem()[1])
        ind = [
            i
            for i, val in enumerate(node["properties"]["parameters"])
            if val["id"] == "task_id"
        ]
        assert len(ind) == 1
        ind = ind[0]

        node["properties"]["parameters"][ind].pop("value")
        with self.assertRaises(DagHandlerValidationError):
            TaskHandler.load_from_node(node)


class TestDagHandlerMarhsalling(Fixture):
    def test_dag_params_from_wml(self):
        di = DagHandler.load_from_wml(self.valid_wml_dict)
        assert di.params["dag_id"]["value"] == "ValidDag"
        assert [t.operator_type for t in di.tasks] == ["BashOperator", "BashOperator"]
        assert len(di.links.node_ids) == 2

        # Note that the rest of the values are defaults and are ignored
        assert list(di.params.keys()) == ["dag_id", "description"]

    def test_dag_params_from_wml_fails_on_missing_required_param(self):
        new_wml = deepcopy(self.valid_wml)
        ind = [
            i
            for i, val in enumerate(new_wml["dag"]["parameters"])
            if val["id"] == "dag_id"
        ]
        assert len(ind) == 1
        ind = ind[0]

        new_wml["dag"]["parameters"][ind].pop("value")
        with self.assertRaises(DagHandlerValidationError):
            DagHandler.load_from_wml(new_wml)

    def test_invalid_dag_fails(self):
        # Add in an additional link that closes the loop - this should break the test
        existing_link = deepcopy(self.valid_wml_dict)["links"].popitem()[1]
        self.valid_wml_dict["links"]["a cyclical link"] = {
            "id": "a cyclical link",
            "from_node": {"nodeId": existing_link["to_node"]["nodeId"]},
            "to_node": {"nodeId": existing_link["from_node"]["nodeId"]},
        }
        with self.assertRaises(DagHandlerValidationError):
            DagHandler.load_from_wml(self.valid_wml_dict)
