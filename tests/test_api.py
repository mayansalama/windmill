import json
import logging
import os
import tempfile
from unittest import TestCase

from flask import Response

from windmill.config.project_config import ProjectConfig
from windmill.http.api.endpoints import build_app
from windmill.models.operators.operator_handler import OperatorHandler
from windmill.tasks.init import CreateProject


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

