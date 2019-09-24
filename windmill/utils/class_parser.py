import inspect
import logging
import re
from copy import deepcopy

from docstring_parser import parse

from ..exceptions import DocstringParseError
from ..models.schemas.app_schemas import (
    validate_parameter_type,
    VALID_PARAMETER_TYPES,
    PARAMETER_MAPPINGS,
)


class ClassParser:
    @classmethod
    def fix_types(cls, typ: str):
        if typ.lower().startswith("a "):
            typ = typ[2:]

        for root, mapping in PARAMETER_MAPPINGS.items():
            if typ.startswith(root):
                typ = mapping

        if typ in PARAMETER_MAPPINGS:
            typ = PARAMETER_MAPPINGS[typ]

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
    def _parse_class_docstring(cls, inherited):
        doc_string = cls.__doc__
        if not doc_string:
            raise DocstringParseError(f"Class {cls} has no docstring")

        if cls.__module__ == "airflow.operators.pig_operator":
            print("hello")

        if doc_string:
            fixed_docs = ClassParser.fix_docstring(doc_string)
            docs = parse(fixed_docs)
            return [
                cls.__name__,
                {
                    "module": cls.__module__,
                    "description": "\n".join(
                        (docs.short_description or "", docs.long_description or "")
                    ),
                    "parameters": [
                        {
                            "id": p.arg_name,
                            "type": p.type_name or "str",
                            "description": p.description,
                            "inheritedFrom": cls.__name__ if inherited else None,
                        }
                        for p in docs.params
                    ],
                },
            ]
        else:
            raise DocstringParseError(f"Unable to parse docstring for class {cls}")

    @staticmethod
    def parse_class(cls, inherit_until=None, inherited=False):
        """Parses class docstrings and parent classes to get class properties
        This will add default values from the func definition as well
        
        Args:
            cls (Class): The class to parse
            inherit_until (Class, optional): If provided will scrape parent class properties, 
                                             until inherit_until class is reached (e.g. BaseOperator)
            inherited (bool, optional): Parameters will include the inheritedFrom property
        
        Returns:
            list: [class name, properties dict]
        """
        name, props = ClassParser._parse_class_docstring(cls, inherited)

        # Get default parameter values from class
        class_sig = inspect.signature(cls)
        for docstring_param in props["parameters"]:
            param = class_sig.parameters.get(docstring_param["id"], None)
            if param:
                if param.default == inspect._empty:
                    docstring_param["required"] = True
                else:
                    docstring_param["default"] = param.default

        if inherit_until:
            additional_params = []
            for parent in [c for c in cls.__bases__ if c == inherit_until]:
                _, parent_props = ClassParser.parse_class(parent, inherit_until, True)
                for param in parent_props["parameters"]:
                    if param["id"] not in [
                        p["id"] for p in (additional_params + props["parameters"])
                    ]:
                        additional_params.append(param)
            props["parameters"].extend(additional_params)

        return name, props
