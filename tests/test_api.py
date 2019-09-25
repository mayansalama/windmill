import json
import logging
import os
import tempfile
from copy import deepcopy
from unittest import TestCase

from flask import Response

from windmill.config.project_config import ProjectConfig
from windmill.http.api.endpoints import build_app
from windmill.models.operators.operator_handler import OperatorHandler
from windmill.tasks.init import CreateProject

from . import test_datafiles


class Fixture(TestCase):
    def setUp(self):
        self.tmpdir = tempfile.TemporaryDirectory()
        os.chdir(self.tmpdir.name)

        self.conf = ProjectConfig.load()
        CreateProject(self.conf)

        os.chdir(os.path.join(self.tmpdir.name, self.conf.name))

        self.client = build_app(self.conf).test_client()
        return super().setUp()

    def tearDown(self):
        self.tmpdir.cleanup()


class TestV1Operators(Fixture):
    def test_get(self):
        res: Response = self.client.get("/v1/operators")
        assert res.status_code == 200

        data = res.get_json()
        for operator in data:
            try:
                op = OperatorHandler.from_dict(operator)
                assert op.type
                assert op.properties
            except Exception as e:
                logging.info(f"{operator}")
                raise e


class TestV1Dag(Fixture):
    def setUp(self):
        res = super().setUp()
        self.base_path = os.path.join(
            self.tmpdir.name, self.conf.name, self.conf.dags_dir
        )
        assert os.path.exists(self.base_path)
        return res

    def test_get(self):
        res: Response = self.client.get("/v1/dag")
        assert res.status_code == 200

        data = res.get_json()
        assert data["description"]
        assert len(data["parameters"]) >= 1
        for param in data["parameters"]:
            assert param["description"]
            assert param["id"]
            assert param["type"]

    def test_post_valid_wml(self):
        data = json.loads(test_datafiles["Valid.wml"])

        res: Response = self.client.post(
            "/v1/dag/Valid.wml", data=json.dumps(data), content_type="application/json"
        )

        assert res.status_code == 201

        with open(os.path.join(self.base_path, "valid_dag.py"), "r") as f:
            assert f.read().strip() == test_datafiles["valid.py"].strip()

    def test_post_invalid_wml(self):
        data = {"no": "data"}
        res: Response = self.client.post(
            "/v1/dag/Valid.wml", data=json.dumps(data), content_type="application/json"
        )
        assert res.status_code == 400

    def test_post_invalid_dag(self):
        data = json.loads(test_datafiles["Valid.wml"])
        existing_link = deepcopy(data)["links"].popitem()[1]
        data["links"]["a broken link"] = {
            "id": "a cyclical link",
            "from": {"nodeId": existing_link["to"]["nodeId"], "portId": "bottom"},
            "to": {"nodeId": existing_link["from"]["nodeId"], "portId": "top"},
        }

        res: Response = self.client.post(
            "/v1/dag/Valid.wml", data=json.dumps(data), content_type="application/json"
        )
        assert res.status_code == 400
        assert res.data == b"Error: Links do not form a valid DAG"


class TestV1Wmls(Fixture):
    def setUp(self):
        res = super().setUp()
        self.base_path = os.path.join(
            self.tmpdir.name, self.conf.name, self.conf.wml_dir
        )
        assert os.path.exists(self.base_path)
        return res

    def test_get_file_list(self):
        with open(os.path.join(self.base_path, "test1.wml"), "w+") as f:
            f.write("")

        res: Response = self.client.get("/v1/wml/")
        assert res.status_code == 200

        data = res.get_json()
        assert data == ["test1.wml"]

    def test_get_file(self):
        with open(os.path.join(self.base_path, "test2.wml"), "w+") as f:
            json.dump(["a", "list"], f)

        res: Response = self.client.get("/v1/wml/test2.wml")
        assert res.status_code == 200

        data = res.get_json()
        assert data == ["a", "list"]

    def test_put_file(self):
        data = {"name": "wml1", "nodes": "etc"}

        res: Response = self.client.post(
            "/v1/wml/test3.wml", data=json.dumps(data), content_type="application/json"
        )

        assert res.status_code == 201

        with open(os.path.join(self.base_path, "test3.wml"), "r") as f:
            self.assertDictEqual(json.load(f), data)
