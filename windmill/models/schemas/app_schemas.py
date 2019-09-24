import re

from marshmallow import Schema, fields


VALID_PARAMETER_TYPES = (
    "str",
    "dict",
    "list",
    "bool",
    "int",
    "float",
    "datetime.timedelta",
    "datetime.datetime",
    "callable",
)

PARAMETER_MAPPINGS = {
    "mapping": "dict",
    "python_callable": "callable",
    "python callable": "callable",
    "lambda": "callable",
    "function": "callable",
}


def validate_parameter_type(typ):
    return typ in VALID_PARAMETER_TYPES


class OperatorParameterSchema(Schema):
    id = fields.Str(required=True)
    type = fields.Str(validator=validate_parameter_type, required=True)
    value = fields.Str()
    default = fields.Str(allow_none=True)
    description = fields.Str()
    required = fields.Bool(default=False)
    inheritedFrom = fields.Str(allow_none=True)


class OperatorPropertiesSchema(Schema):
    name = fields.Str()
    module = fields.Str()
    description = fields.Str()
    parameters = fields.List(fields.Nested(OperatorParameterSchema()), required=True)


class OperatorSchema(Schema):
    type = fields.Str()
    properties = fields.Nested(OperatorPropertiesSchema())


class DagSchema(Schema):
    name = fields.Str(required=False)
    description = fields.Str()
    parameters = fields.List(fields.Nested(OperatorParameterSchema()), required=True)


class PositionSchema(Schema):
    x = fields.Int(required=True)
    y = fields.Int(required=True)


class PortSchema(Schema):
    id = fields.Str(required=True)
    type = fields.Str(required=True, validator=lambda typ: typ in ("top", "bottom"))
    properties = fields.Dict(keys=fields.Str(), values=fields.Str())
    position = fields.Nested(PositionSchema, required=True)


class SizeSchema(Schema):
    width = fields.Int()
    height = fields.Int()


class NodeSchema(Schema):
    id = fields.Str(required=True)
    position = fields.Nested(PositionSchema, required=True)
    orientation = fields.Int(required=True)
    type = fields.Str(required=True)
    ports = fields.Dict(keys=fields.Str(), values=fields.Nested(PortSchema))
    properties = fields.Nested(OperatorPropertiesSchema())
    size = fields.Nested(SizeSchema)


class LinkSpecSchema(Schema):
    nodeId = fields.Str(required=True)
    portId = fields.Str(required=True)


class LinkSchema(Schema):
    id = fields.Str(required=True)
    from_node = fields.Nested(LinkSpecSchema, data_key="from", required=True)
    to_node = fields.Nested(LinkSpecSchema, data_key="to", required=True)


class MinimalWmlSchema(Schema):
    # This is the minimal amount of data required to create an Airflow DAG
    filename = fields.Str(required=True)
    dag = fields.Nested(DagSchema, required=True)
    nodes = fields.Dict(
        keys=fields.Str(), values=fields.Nested(NodeSchema), required=True
    )
    links = fields.Dict(
        keys=fields.Str(), values=fields.Nested(LinkSchema), required=True
    )
