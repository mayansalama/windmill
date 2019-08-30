import json
import logging
import os

from flask import Flask, jsonify, make_response, request, send_from_directory
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


@app.route("/v1/wml/", methods=["GET"])
@app.route("/v1/wml/<name>", methods=["GET"])
def get_wmls(name=None):
    if name:
        f_path = os.path.join(app.config["project_conf"].wml_dir, name)
        if os.path.exists(f_path):
            with open(f_path, "r") as f:
                data = json.load(f)
            return jsonify(data), 200
        else:
            return f"File {f_path} not found", 404
    else:
        return jsonify(os.listdir(app.config["project_conf"].wml_dir)), 200


@app.route("/v1/wml/<name>", methods=["POST"])
def post_wml(name):
    content = request.json
    # TODO: Validation

    f_path = os.path.join(app.config["project_conf"].wml_dir, name)
    with open(f_path, "w") as f:
        json.dump(content, f)

    return "Created", 201


#######################################################################
# Build App
#######################################################################
def build_app(proj_conf: ProjectConfig, dev_server=False):
    app.config["project_conf"] = proj_conf

    if dev_server:
        logging.warning("Running a dev-build with CORS enabled")
        CORS(app)

    return app
