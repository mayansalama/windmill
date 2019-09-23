import argparse
import logging
import os
import subprocess
from copy import deepcopy

from decli import cli

from ..config.project_config import ProjectConfig
from ..config.run_config import RunConfig
from ..http.api.endpoints import app
from ..tasks.init import CreateProject
from ..tasks.run import StartWebserver


class Cli:
    @staticmethod
    def get_cli_spec():
        return {
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
                        "arguments": ProjectConfig.to_cli_args(),
                    },
                    {
                        "name": "run",
                        "help": "Start Windmill server from a project folder",
                        "func": Cli.run_server,
                        "arguments": RunConfig.to_cli_args(),
                    },
                ],
            },
        }

    @classmethod
    def init(cls, *args, **kwargs):
        try:
            project = ProjectConfig.load(*args, **kwargs)
            CreateProject(project)
        except Exception as e:
            logging.error(f"Unable to create project ({e}) - aborting")
            return e

    @classmethod
    def run_server(cls, *args, **kwargs):
        try:
            run_config = RunConfig.load(*args, **kwargs)
            StartWebserver(run_config)
        except Exception as e:
            logging.error(f"Unable to start webserver ({e}) - aborting")

    @staticmethod
    def run_cli():
        return run_parser(get_parser(Cli.get_cli_spec()))


class DevCli:
    @staticmethod
    def get_cli_spec():
        return {
            "prog": "windmill",
            "description": "Dev commands for working on Windmill",
            "subcommands": {
                "title": "positional arguments",
                "description": "Run 'windmill <arg> --help' for further details",
                "commands": [
                    {
                        "name": "start-backend",
                        "help": "Starts the backend flask server with CORS enabled",
                        "func": DevCli.start_backend,
                        "arguments": RunConfig.to_cli_args(),
                    },
                    {
                        "name": "start-frontend",
                        "help": "Starts the frontend react server using npm build",
                        "func": DevCli.start_frontend,
                        "arguments": [],
                    },
                ],
            },
        }

    @staticmethod
    def start_backend(*args, **kwargs):
        try:
            wd = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
            print("Deleting existing windmill dev project")
            p = subprocess.Popen(
                ["rm", "-rf", ".windmill-temp-project/"], cwd=wd, stdout=subprocess.PIPE
            )
            p.communicate()

            print("Creating new project")
            p = subprocess.Popen(
                ["windmill", "init", "--name", ".windmill-temp-project"],
                cwd=wd,
                stdout=subprocess.PIPE,
            )
            p.communicate()

            print("Starting dev backend")
            os.chdir(
                os.path.abspath(
                    os.path.join(
                        os.path.dirname(__file__), "..", "..", ".windmill-temp-project/"
                    )
                )
            )
            run_config = RunConfig.load(run_dev_server=True, *args, **kwargs)
            StartWebserver(run_config)
        except Exception as e:
            logging.error(f"Unable to start webserver ({e}) - aborting")

    @staticmethod
    def start_frontend(**kwargs):
        wd = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..", "http", "app")
        )
        with subprocess.Popen(["npm", "start"], cwd=wd, stdout=subprocess.PIPE):
            print("Running frontend on http://localhost:1234")

    @staticmethod
    def run_cli():
        return run_parser(get_parser(DevCli.get_cli_spec()))


def get_parser(cli_spec) -> argparse.ArgumentParser:
    cli_spec["formatter_class"] = argparse.ArgumentDefaultsHelpFormatter
    return cli(cli_spec)


def run_parser(parser):
    args = parser.parse_args()

    try:
        args.func(**vars(args))
    except AttributeError:
        print(f"Error parsing args `{vars(args) or 'None'}`")
        parser.print_help()
