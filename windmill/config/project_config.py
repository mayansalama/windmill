import os
from collections import namedtuple

import yaml
from marshmallow import fields, Schema

from .base_config import BaseConfig
from ..constants import ProjectDefaults
from ..exceptions import InitError


class ProjectConfig(BaseConfig):
    schema = Schema.from_dict(
        {
            # CLI Arguments
            "name": fields.Str(
                missing=ProjectDefaults.PROJECT_NAME,
                help="Name of the root project folder",
            ),
            "wml_dir": fields.Str(
                missing=ProjectDefaults.WML_FOLDER,
                help="Folder to store windmill WML files",
            ),
            "dags_dir": fields.Str(
                missing=ProjectDefaults.DAGS_FOLDER,
                help="Folder to store generated YML DAG files",
            ),
            "operators_dir": fields.Str(
                missing=ProjectDefaults.OPERATORS_FOLDER,
                help="Folder to store custom operator files",
            ),
        }
    )

    def __init__(
        self,
        name: str,
        wml_dir: str,
        dags_dir: str,
        operators_dir: str,
        conf_file: str = ProjectDefaults.PROJECT_CONF,
        *args,
        **kwargs,
    ):
        """Handler for project file
        
        Args:
            ...Project.schema
            conf_file (str, optional): Default project config filename. Defaults to ProjectDefaults.PROJECT_CONF.
        """
        self.name = name
        self.wml_dir = wml_dir
        self.dags_dir = dags_dir
        self.operators_dir = operators_dir
        self.conf_file = conf_file

    @staticmethod
    def from_conf_file(filename):
        try:
            with open(filename, "r+") as f:
                return ProjectConfig(**yaml.load(f))
        except Exception as e:
            raise InitError("This directory is not a valid windmill project") from e
