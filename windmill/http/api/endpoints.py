from flask import Flask, make_response, jsonify
from flask_cors import CORS

from ...models.dags.dag_handler import DagHandler
from ...models.operators.operator_index import OperatorIndex
from ...models.schemas.app_schemas import OperatorSchema

app = Flask(__name__)
CORS(app)
_operator_index: OperatorIndex = None


def get_operator_index() -> OperatorIndex:
    global _operator_index

    if not _operator_index:
        _operator_index = OperatorIndex()
    return _operator_index


@app.route("/v1/operators", methods=["GET"])
def get_operators():
    """Retrieves a JSON list of all available Airflow Operators
    
    Returns:
        List(OperatorIndex)
    """
    return jsonify(get_operator_index().marshall_operator_list()), 200


@app.route("/v1/dag", methods=["GET"])
def get_dagspec():
    return jsonify(DagHandler.marshall_dag_object()), 200
