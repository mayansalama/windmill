import logging
from unittest import TestCase

from flask import Response

from windmill.http.api import endpoints
from windmill.operators.operator_handler import OperatorHandler


class Fixture(TestCase):
    def setUp(self):
        self.client = endpoints.app.test_client()
        return super().setUp()


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
