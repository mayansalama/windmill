from flask import Flask, make_response, jsonify

from ...schemas.app_schemas import OperatorSchema
from ...operators.operator_index import OperatorIndex

app = Flask(__name__)
operator_index = OperatorIndex()


@app.route("/v1/operators", methods=["GET"])
def get_operators():
    """Retrieves a JSON list of all available Airflow Operators
    
    Returns:
        List(OperatorIndex)
    """
    return jsonify(operator_index.marshall_operator_list()), 200
