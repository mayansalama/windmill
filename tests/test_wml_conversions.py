import json
from copy import deepcopy
from unittest import TestCase

from marshmallow import EXCLUDE

from windmill.exceptions import DagInstanceValidationError
from windmill.models.schemas.app_schemas import MinimalWmlSchema
from windmill.models.schemas.airflow_schemas import DagInstance, TaskInstance

from . import test_datafiles


class Fixture(TestCase):
    def setUp(self):
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


class TestTaskMarshalling(Fixture):
    def test_task_marshall_from_node(self):
        nodes: dict = self.valid_wml_dict["nodes"]
        node = nodes.popitem()[1]
        ti = TaskInstance.load_from_node(node)

        assert ti.module == "airflow.operators.python_operator"
        assert ti.operator_type == "PythonOperator"
        assert list(ti.task_params.keys()) == ["python_callable", "task_id"]

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
        with self.assertRaises(DagInstanceValidationError):
            TaskInstance.load_from_node(node)


class TestDagInstanceMarhsalling(Fixture):
    def test_dag_params_from_wml(self):
        di = DagInstance.load_from_wml(self.valid_wml_dict)
        assert di.dag_params["dag_id"] == "ValidDag"
        assert [t.operator_type for t in di.tasks] == ["BashOperator", "PythonOperator"]
        assert len(di.links.node_ids) == 2

        # Note that the rest of the values are defaults and are ignored
        assert list(di.dag_params.keys()) == ["dag_id", "description"]

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
        with self.assertRaises(DagInstanceValidationError):
            DagInstance.load_from_wml(new_wml)

    def test_invalid_dag_fails(self):
        # Add in an additional link that closes the loop - this should break the test
        existing_link = deepcopy(self.valid_wml_dict)["links"].popitem()[1]
        self.valid_wml_dict["links"]["a broken link"] = {
            "id": "a broken link",
            "from_node": {"nodeId": existing_link["to_node"]["nodeId"]},
            "to_node": {"nodeId": existing_link["from_node"]["nodeId"]},
        }
        with self.assertRaises(DagInstanceValidationError):
            DagInstance.load_from_wml(self.valid_wml_dict)
