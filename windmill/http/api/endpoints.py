import json
import logging
import os

from flask import Flask, jsonify, make_response, request, send_from_directory
from flask_cors import CORS
from marshmallow import EXCLUDE
from marshmallow.exceptions import ValidationError

from ...config.project_config import ProjectConfig
from ...exceptions import DagHandlerValidationError
from ...models.dags.dag_handler import DagHandler
from ...models.operators.operator_index import OperatorIndex
from ...models.schemas.app_schemas import OperatorSchema, MinimalWmlSchema


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
    logging.info(f"GET /v1/operators")

    return jsonify(get_operator_index().marshall_operator_list()), 200


@app.route("/v1/wml/", methods=["GET"])
@app.route("/v1/wml/<name>", methods=["GET"])
def get_wmls(name=None):
    logging.info(f"GET /v1/wml/{name}")

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
    logging.info(f"POST /v1/wml/{name}")

    content = request.json
    # TODO: Is validation required here or just on DAG?

    f_path = os.path.join(app.config["project_conf"].wml_dir, name)
    with open(f_path, "w") as f:
        json.dump(content, f)

    return "Created", 201


@app.route("/v1/dag", methods=["GET"])
def get_dagspec():
    logging.info(f"GET /v1/dag/")

    return jsonify(DagHandler.marshall_dag_docstring()), 200


@app.route("/v1/dag/<name>", methods=["POST"])
def post_dag(name):
    logging.info(f"POST /v1/dag/{name}")

    res = post_wml(name)
    if res[1] == 201:
        f_path = os.path.join(app.config["project_conf"].wml_dir, name)
        with open(f_path, "r") as f:
            wml_dict = json.load(f)

        try:
            wml_dict_parsed = MinimalWmlSchema().load(
                wml_dict, partial=False, unknown=EXCLUDE
            )
        except ValidationError as e:
            logging.exception("Error parsing WML")
            return "Unable to deserialise WML contents", 400

        try:
            dag_handler = DagHandler.load_from_wml(wml_dict_parsed)
            py_content = dag_handler.compile_to_python()
        except DagHandlerValidationError as e:
            logging.exception(f"Unable to convert WML '{name}' to DAG")
            return f"Error: {e}", 400
        except Exception as e:
            logging.exception(f"Unknwon error while converting WML {name}")
            return f"Internal error converting WML", 500

        f_path = os.path.join(
            app.config["project_conf"].dags_dir, f"{dag_handler.snake_name}.py"
        )
        with open(f_path, "w") as f:
            f.write(py_content)

        return "Created", 201
    else:
        return res


#######################################################################
# Build App
#######################################################################
def build_app(proj_conf: ProjectConfig, dev_server=False):
    app.config["project_conf"] = proj_conf

    if dev_server:
        logging.warning("Running a dev-build with CORS enabled")
        CORS(app)

    return app
