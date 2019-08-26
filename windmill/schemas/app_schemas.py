import re

from marshmallow import Schema, fields


VALID_PARAMETER_TYPES = (
    "str",
    "dict",
    "list",
    "mapping",
    "bool",
    "int",
    "float",
    "datetime.timedelta",
    "datetime.datetime",
)


def validate_parameter_type(typ):
    return typ in VALID_PARAMETER_TYPES


class OperatorParameterSchema(Schema):
    id = fields.Str(required=True)
    type = fields.Str(validator=validate_parameter_type, required=True)
    default = fields.Str()
    value = fields.Str()
    description = fields.Str()


class OperatorPropertiesSchema(Schema):
    name = fields.Str()
    module = fields.Str()
    description = fields.Str()
    parameters = fields.List(fields.Nested(OperatorParameterSchema()), required=True)


class OperatorSchema(Schema):
    type = fields.Str()
    properties = fields.Nested(OperatorPropertiesSchema())
