import os
import subprocess
from copy import deepcopy

from decli import cli

from ..http.api.endpoints import app


def start_backend(port, **kwargs):
    app.run(port=port)


def start_frontend(**kwargs):
    wd = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "http", "app"))
    subprocess.Popen(["npm", "start"], cwd=wd)


cli_spec = {
    "prog": "windmill",
    "description": "Drag'N'Drop UI to Build Airflow DAGs",
    "subcommands": {
        "title": "positional arguments",
        "description": "Run 'windmill <arg> --help' for further details",
        "commands": [
            {
                "name": "start-backend",
                "help": "Starts the backend flask server",
                "func": start_backend,
                "arguments": [{"name": "--port", "default": 8000, "type": int}],
            },
            {
                "name": "start-frontend",
                "help": "Starts the frontend react server",
                "func": start_frontend,
                "arguments": [],
            },
        ],
    },
}


def run_cli():
    parser = cli(cli_spec)
    args = parser.parse_args()

    try:
        args.func(**vars(args))
    except AttributeError:
        print(f"Error parsing args `{vars(args) or 'None'}`")
        parser.print_help()
