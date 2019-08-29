import argparse
import logging
import os
import subprocess
from copy import deepcopy

from decli import cli

from ..config.project import Project
from ..http.api.endpoints import app
from ..tasks.create_project import CreateProject


class Cli:
    @staticmethod
    def init(*args, **kwargs):
        try:
            project = Project().load_to_obj(kwargs, unknown="EXCLUDE")
            CreateProject(project)
        except Exception:
            logging.exception("Unable to create project - aborting")

    @staticmethod
    def run():
        return run_parser(
            {
                "prog": "windmill",
                "description": "Drag'N'Drop web app to build and manage Airflow DAGs",
                "subcommands": {
                    "title": "positional arguments",
                    "description": "Run 'windmill <arg> --help' for further details",
                    "commands": [
                        {
                            "name": "init",
                            "help": "Creates a new windmill project",
                            "func": Cli.init,
                            "arguments": Project.to_cli_args(),
                        }
                    ],
                },
            }
        )


class DevCli:
    @staticmethod
    def start_backend(port, **kwargs):
        app.run(port=port)

    @staticmethod
    def start_frontend(**kwargs):
        wd = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..", "http", "app")
        )
        subprocess.Popen(["npm", "start"], cwd=wd)

    @staticmethod
    def run():
        return run_parser(
            {
                "prog": "windmill",
                "description": "Dev commands for working on Windmill",
                "subcommands": {
                    "title": "positional arguments",
                    "description": "Run 'windmill <arg> --help' for further details",
                    "commands": [
                        {
                            "name": "start-backend",
                            "help": "Starts the backend flask server",
                            "func": DevCli.start_backend,
                            "arguments": [
                                {"name": "--port", "default": 8000, "type": int}
                            ],
                        },
                        {
                            "name": "start-frontend",
                            "help": "Starts the frontend react server",
                            "func": DevCli.start_frontend,
                            "arguments": [],
                        },
                    ],
                },
            }
        )


def run_parser(cli_spec):
    cli_spec["formatter_class"] = argparse.ArgumentDefaultsHelpFormatter
    parser = cli(cli_spec)
    args = parser.parse_args()

    try:
        args.func(**vars(args))
    except AttributeError:
        print(f"Error parsing args `{vars(args) or 'None'}`")
        parser.print_help()
