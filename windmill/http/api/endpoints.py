import os

from flask import Flask, make_response, jsonify, send_from_directory
from flask_cors import CORS

from ...config.project_config import ProjectConfig
from ...models.dags.dag_handler import DagHandler
from ...models.operators.operator_index import OperatorIndex
from ...models.schemas.app_schemas import OperatorSchema


_operator_index: OperatorIndex = None


def get_operator_index() -> OperatorIndex:
    global _operator_index

    if not _operator_index:
        _operator_index = OperatorIndex()
    return _operator_index


app = Flask(__name__, static_folder="../app/dist/")

#######################################################################
# Serve React App
#######################################################################
@app.route("/")
def serve():
    return send_from_directory(app.static_folder, "index.html")


#######################################################################
# API Endpoints
#######################################################################
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


@app.route("/v1/wml/list", methods=["GET"])
def get_wmls():
    return jsonify(os.listdir(app.config["project_conf"].wml_path)), 200


#######################################################################
# Build App
#######################################################################
def build_app(proj_conf: ProjectConfig, dev_server=False):
    app.config["project_conf"] = proj_conf

    if dev_server:
        CORS(app)

    return app
