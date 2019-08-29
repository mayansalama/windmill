import logging
import re

from airflow.operators import BaseOperator
from docstring_parser import parse
from marshmallow import schema

from ..schemas.app_schemas import (
    OperatorSchema,
    validate_parameter_type,
    VALID_PARAMETER_TYPES,
)
from ...utils import class_parser
from ... import exceptions


class OperatorHandler:
    """Handler to translate between Schemas, Operator Objects and
    dictionaries
    """

    schema = OperatorSchema()
    docstring_parser = class_parser.ClassParser()

    def __init__(self, type: str, properties: dict):
        """Should initialise using the from_marsh or from_operator method

        Args:
            type (str):  Operator Name
            properties (dict): Operator Properties
        """
        self.type = type
        self.properties = properties

    def dump(self):
        """Serialise to dict

        Returns:
            Dict: Marshalled result
        """
        return self.schema.dump(self)

    @classmethod
    def from_operator(cls, operator: BaseOperator.__class__):
        """Instantiate a handler from an Airflow Operator

        Arguments:
            operator {BaseOperator} -- Airflow Operator Class
        """
        try:
            return OperatorHandler(
                *cls.docstring_parser.parse_class(operator, inherit_until=BaseOperator)
            )
        except exceptions.DocstringParseError as e:
            raise exceptions.OperatorMarshallError(
                f"Unable to parse class {operator.__name__}"
            ) from e

    @staticmethod
    def from_dict(d: dict):
        """[summary]
        
        Args:
            d (dict): Unparsed dict
        
        Returns:
            OperatorHandler: Parsed operator handler
        """
        return OperatorHandler.from_marsh(OperatorHandler.schema.load(d))

    @staticmethod
    def from_marsh(res: dict):
        """Instantiate a handler from an Unmarshal Result

        Args:
            data (dict): Result from Marshmallow.load
        
        Returns:
            OperatorHandler: Parsed operator handler
        """
        return OperatorHandler(res["type"], res["properties"])
