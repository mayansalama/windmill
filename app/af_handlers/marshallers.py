from marshmallow import Schema, fields


class OperatorParameterSchema(Schema):
    id = fields.Str()
    type = fields.Str()
    default = fields.Str()
    value = fields.Str()


class OperatorPropertiesSchema(Schema):
    name = fields.Str()
    parameters = fields.List(fields.Nested(OperatorParameterSchema()))


class OperatorSchema(Schema):
    type = fields.Str()
    properties = fields.Nested(OperatorPropertiesSchema())
