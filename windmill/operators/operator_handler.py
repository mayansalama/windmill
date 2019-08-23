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
from ..utils.exceptions import OperatorMarshallError


def fix_types(typ: str):
    if typ.lower().startswith("a "):
        typ = typ[2:]
    for root in VALID_PARAMETER_TYPES:
        if typ.startswith(root):
            typ = root
    return typ


def fix_docstring(docs: str):
    """Helper to convert Airflow Operator.__doc__ into valid docstrings so 
    docstring_parser can pick up types.

    Note that this will mung the parsed datatypes, defaulting to a str data
    type.

    Args:
        docs (str): Valid Airflow docstring, eg
            Some description...

            :param param1: some param
            :type param1: e.g. str
            ...

    return str: Reformatted str eg
            Some description...

            :param str param1: some param
            :type param1: e.g. str
            ...
    """
    type_re = r":type (.*): (.*)"

    for param, typ in re.findall(type_re, docs):
        typ = fix_types(typ)
        if not validate_parameter_type(typ) or not typ:
            logging.warning(f"Unable to parse field {typ}")
            typ = "str"
        docs = docs.replace(f":param {param}:", f":param {typ} {param}:")
    return docs


class OperatorHandler:
    """Handler to translate between Mashall Schemas, Operator Objects and
    dictionaries
    """

    schema = OperatorSchema()

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

    @staticmethod
    def from_operator(operator: BaseOperator.__class__):
        """Instantiate a handler from an Airflow Operator

        Arguments:
            operator {BaseOperator} -- Airflow Operator Class
        """
        doc_string = operator.__doc__
        if not doc_string and BaseOperator not in operator.__bases__:
            doc_string = operator.__bases__[0].__doc__

        if doc_string:
            fixed_docs = fix_docstring(doc_string)
            docs = parse(fixed_docs)
            return OperatorHandler(
                operator.__name__,
                {
                    "parameters": [
                        {
                            "id": p.arg_name,
                            "type": p.type_name or "str",
                            "description": p.description,
                        }
                        for p in docs.params
                    ]
                },
            )
        else:
            raise OperatorMarshallError(f"Unable to parse docstring for class {operator}")

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
