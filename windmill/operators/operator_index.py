import inspect
import logging
import pkgutil
from importlib import import_module

from airflow import operators

from .operator_handler import OperatorHandler


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

    def get_operators(self):
        return self.get_default_operators()

    def marshall_operator_list(self):
        handlers = [OperatorHandler.from_operator(o) for o in self.operator_list]
        return [h.dump() for h in handlers]

    @staticmethod
    def get_default_operators():
        ops = set()
        for _, modname, _ in pkgutil.iter_modules(operators.__path__):
            try:
                mod = import_module(f"airflow.operators.{modname}")
            except (ModuleNotFoundError, SyntaxError) as e:
                logging.info(f"Unable to import operator from {modname}: {e}")

            ops = ops.union(
                {
                    v
                    for v in mod.__dict__.values()
                    if inspect.isclass(v) and issubclass(v, operators.BaseOperator)
                }
            )

        return list(ops)
