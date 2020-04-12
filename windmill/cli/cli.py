import argparse
import logging
import os, sys
import subprocess
from copy import deepcopy

from decli import cli
from doccli import DocCliParser

from ..config.project_config import ProjectConfig
from ..config.run_config import RunConfig
from ..constants import ProjectDefaults
from ..http.api.endpoints import app
from ..tasks.init import CreateProject
from ..tasks.run import StartWebserver


def run_parser(parser: DocCliParser):
    try:
        args = parser.parse_args_with_config_file(ProjectDefaults.PROJECT_CONF)
    except FileNotFoundError:
        args = parser.parse_args()

    try:
        params = vars(args)
        func = params.pop("func")
        func(**params)
    except (KeyError, AttributeError):
        print(f"Error parsing args `{vars(args) or 'None'}`")
        parser.parser.print_help()


class Cli:
    command_name = "windmill"

    def __init__(self, save_config: bool = False, *args, **kwargs):
        """Drag'N'Drop web app to build and manage Airflow DAGs
        
        Args:
            save_config (bool): If True will save CLI arguments to the config file.
        """
        self.save_config = save_config

    @classmethod
    def init(cls, save_config, *args, **kwargs):
        try:
            project = ProjectConfig(*args, **kwargs)
            CreateProject(project)
        except Exception as e:
            logging.error(f"Unable to create project ({e}) - aborting")
            return e

    @classmethod
    def run_server(cls, save_config, *args, **kwargs):
        try:
            run_config = RunConfig(*args, **kwargs)
            if save_config:
                logging.info("Updating config")

            StartWebserver(run_config)
        except Exception as e:
            logging.error(f"Unable to start webserver ({e}) - aborting")

    @classmethod
    def get_parser(cls):
        parser = DocCliParser(cls)
        parser.add_subcommand(ProjectConfig, func=cls.init)
        parser.add_subcommand(RunConfig, func=cls.run_server)

        return parser

    @classmethod
    def run_cli(cls):
        parser = cls.get_parser()
        run_parser(parser)


class DevCli:
    """Dev commands for working on Windmill
    """

    command_name = "windmill-dev"

    class StartFrontend:
        """Starts the frontend react server using npm build
        """

        command_name = "start-frontend"

        @staticmethod
        def start_frontend(**kwargs):
            wd = os.path.abspath(
                os.path.join(os.path.dirname(__file__), "..", "http", "app")
            )
            with subprocess.Popen(["npm", "start"], cwd=wd, stdout=subprocess.PIPE):
                print("Running frontend on http://localhost:1234")

    class StartBackend(RunConfig):
        """Starts the backend flask server with CORS enabled
        """

        command_name = "start-backend"

        @staticmethod
        def start_backend(*args, **kwargs):
            try:
                wd = os.path.abspath(
                    os.path.join(os.path.dirname(__file__), "..", "..")
                )
                print("Deleting existing windmill dev project")
                p = subprocess.Popen(
                    ["rm", "-rf", ".windmill-temp-project/"],
                    cwd=wd,
                    stdout=subprocess.PIPE,
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
                            os.path.dirname(__file__),
                            "..",
                            "..",
                            ".windmill-temp-project/",
                        )
                    )
                )
                run_config = RunConfig(_run_dev_server=True, *args, **kwargs)
                StartWebserver(run_config)
            except Exception as e:
                logging.error(f"Unable to start webserver ({e}) - aborting")

    @classmethod
    def run_cli(cls):
        parser = DocCliParser(cls)
        parser.add_subcommand(cls.StartFrontend, func=cls.StartFrontend.start_frontend)
        parser.add_subcommand(cls.StartBackend, func=cls.StartBackend.start_backend)

        run_parser(parser)
