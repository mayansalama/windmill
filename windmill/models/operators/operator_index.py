import inspect
import logging
import pkgutil
from importlib import import_module

from airflow import operators

from .operator_handler import OperatorHandler
from ...exceptions import OperatorMarshallError


__all__ = ["get_operator_index"]


class OperatorIndex:
    def __init__(self, custom_operators=""):
        """Stateful object to index built-in and custom airflow
        operators

        Args:
            custom_operators (str, optional): Path to directory containing 
                custom operators. Defaults to "".
        """

        self.custom_operators = custom_operators
        self.operator_list = self.get_operators()
        self._marshalled_operators = None

    @property
    def marshalled_operators(self):
        if not self._marshalled_operators:
            self._marshalled_operators = self.marshall_operator_list()
        return self._marshalled_operators
    
    def marshall_operator(self, operator):
        return OperatorHandler.from_operator(operator).dump()

    def marshall_operator_list(self):
        """Return a JSON marshalled list of Operators as per OperatorHandler schema
        
        Returns:
            List[Dict]: List of OperatorHandler Dict - see `schemas.app_schemas.OperatorSchema`
        """
        handlers = []
        for operator in self.operator_list:
            try:
                handlers.append(OperatorHandler.from_operator(operator))
            except OperatorMarshallError as e:
                logging.exception(f"Unable to parse operator {operator.__name__}: {e}")

        return [h.dump() for h in handlers]

    def get_operators(self):
        """Get all default and custom operators
        
        Returns:
            List[Operator]: List of classes that inherit from BaseOperator
        """
        return self.get_default_operators()

    @staticmethod
    def get_default_operators():
        """Scrapes operators module for all classes that inherit from the BaseOperator
        class
        
        Returns:
            List[Operator]: List of Operator classes
        """
        ops = set()
        for _, modname, _ in pkgutil.iter_modules(operators.__path__):
            try:
                mod = import_module(f"airflow.operators.{modname}")
            except (ModuleNotFoundError, SyntaxError) as e:
                # NOTE Some of the HDFS libraries in Airflow don't support Python 3
                logging.info(f"Unable to import operator from {modname}: {e}")

            ops = ops.union(
                {
                    v
                    for v in mod.__dict__.values()
                    if inspect.isclass(v) and issubclass(v, operators.BaseOperator)
                }
            )

        return list(ops)


_operator_index: OperatorIndex = None


def get_operator_index() -> OperatorIndex:
    global _operator_index

    if not _operator_index:
        _operator_index = OperatorIndex()
    return _operator_index
