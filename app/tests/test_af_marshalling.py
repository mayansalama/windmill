from unittest import TestCase

from ..af_handlers.marshallers import OperatorSchema
from ..af_handlers.operator_handler import OperatorHandler


class TestOperatorMarshalling(TestCase):

    test_input = {
        "type": "bool-param",
        "properties": {
            "parameters": [{"id": "useLegacySql",
                            "type": "bool",
                            "default": "true"}]
        }
    }

    def test_dict_to_operator(self):
        operator_data = OperatorSchema().load(self.test_input)
        self.assertDictEqual(operator_data.data, self.test_input)

        assert not operator_data.errors

    def test_marshall_result_to_operator_handler(self):
        operator_data = OperatorSchema().load(self.test_input)
        oh = OperatorHandler.from_marsh(operator_data)
        assert oh

        marshalled_oh = OperatorSchema().dump(oh)

        self.assertDictEqual(marshalled_oh.data, operator_data.data)
