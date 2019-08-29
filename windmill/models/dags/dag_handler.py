from airflow.models.dag import DAG

from ..schemas.app_schemas import DagSchema
from ...utils.class_parser import ClassParser


class DagHandler:
    """Helper class to marshall between Airflow DAGs and Windmill
    schemas
    """

    docstring_parser = ClassParser()

    @classmethod
    def marshall_dag_object(cls):
        return DagSchema().dump(cls.docstring_parser.parse_class(DAG)[1])
