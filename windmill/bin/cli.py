import logging.config
from copy import deepcopy

from decli import cli

from ..http.api.endpoints import app


def start_backend(port, **kwargs):
    app.run(port=port)


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
            }
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
