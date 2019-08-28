import logging
import re

from docstring_parser import parse

from .exceptions import DocstringParseError
from ..schemas.app_schemas import validate_parameter_type, VALID_PARAMETER_TYPES


class DocstringParser:
    @classmethod
    def fix_types(cls, typ: str):
        if typ.lower().startswith("a "):
            typ = typ[2:]
        for root in VALID_PARAMETER_TYPES:
            if typ.startswith(root):
                typ = root
        return typ

    @classmethod
    def fix_docstring(cls, docs: str):
        """Helper to convert Airflow __doc__ into valid docstring_parser
        docstrings 

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
            typ = cls.fix_types(typ)
            if not validate_parameter_type(typ) or not typ:
                logging.warning(f"Unable to parse field {typ}")
                typ = "str"
            docs = docs.replace(f":param {param}:", f":param {typ} {param}:")
        return docs

    @staticmethod
    def parse_class_docstring(cls):
        doc_string = cls.__doc__
        if not doc_string:
            raise DocstringParseError(f"Class {cls} has no docstring")

        # TODO: Grab parent class properties
        parent_classes = cls.__bases__

        if cls.__module__ == "airflow.operators.pig_operator":
            print("hello")

        if doc_string:
            fixed_docs = DocstringParser.fix_docstring(doc_string)
            docs = parse(fixed_docs)
            return [
                cls.__name__,
                {
                    "module": cls.__module__,
                    "description": '\n'.join((docs.short_description or '', docs.long_description or '')),
                    "parameters": [
                        {
                            "id": p.arg_name,
                            "type": p.type_name or "str",
                            "description": p.description,
                        }
                        for p in docs.params
                    ],
                },
            ]
        else:
            raise DocstringParseError(f"Unable to parse docstring for class {cls}")

