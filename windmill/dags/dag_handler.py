from airflow.models.dag import DAG

from ..schemas.app_schemas import DagSchema
from ..utils.docstring_parser import DocstringParser


class DagHandler:
    """Helper class to marshall between Airflow DAGs and Windmill
    schemas
    """

    docstring_parser = DocstringParser()

    @classmethod
    def marshall_dag_object(cls):
        return DagSchema().dump(cls.docstring_parser.parse_class_docstring(DAG)[1])
