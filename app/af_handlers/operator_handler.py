from airflow.operators import BaseOperator
from marshmallow import UnmarshalResult


class OperatorHandler:
    """Handler to translate between Mashall Schemas, Operator Objects and
    dictionaries
    """

    def __init__(self, type: str, properties: dict):
        """Should initialise using the from_marsh or from_operator method

        Args:
            type (str):  Operator Name
            properties (dict): Operator Properties
        """
        self.type = type
        self.properties = properties

    @staticmethod
    def from_operator(operator: BaseOperator):
        """Instantiate a handler from an Airflow Operator

        Arguments:
            operator {BaseOperator} -- Airflow Operator Class
        """
        pass

    @staticmethod
    def from_marsh(res: UnmarshalResult):
        """Instantiate a handler from an Unmarshal Result

        Args:
            data (UnmarshalResult): Result from Marshmallow.load
        """
        return OperatorHandler(
            res.data["type"],
            res.data["properties"]
        )
