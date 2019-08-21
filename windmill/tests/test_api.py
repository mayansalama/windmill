from unittest import TestCase

from flask import Response

from ..http.api import endpoints
from ..operators.operator_handler import OperatorHandler


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
            op = OperatorHandler.from_dict(operator)
            assert op.type
            assert op.properties
