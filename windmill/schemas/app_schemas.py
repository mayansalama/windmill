import re

from marshmallow import Schema, fields


def validate_parameter_type(typ):
    VALID_PARAMETER_TYPES = ("dict", "str", "bool", "mapping", "float")
    VALID_REG_PATTERNS = (r"list\[.*\]",)

    return typ in VALID_PARAMETER_TYPES or any(
        [re.match(p, typ) for p in VALID_REG_PATTERNS]
    )


class OperatorParameterSchema(Schema):
    id = fields.Str()
    type = fields.Str(validator=validate_parameter_type)
    default = fields.Str()
    value = fields.Str()
    description = fields.Str()


class OperatorPropertiesSchema(Schema):
    name = fields.Str()
    parameters = fields.List(fields.Nested(OperatorParameterSchema()))


class OperatorSchema(Schema):
    type = fields.Str()
    properties = fields.Nested(OperatorPropertiesSchema())
