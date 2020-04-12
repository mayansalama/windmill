from doccli import ConfigUtil

from .run_config import RunConfig
from ..constants import ProjectDefaults
from ..exceptions import InitError


class ProjectConfig(ConfigUtil):
    command_name = "init"
    config_key = "project.config"
    sub_config_list = [RunConfig]

    def __init__(
        self,
        name: str = ProjectDefaults.PROJECT_NAME,
        git_remote: str = None,
        wml_dir: str = ProjectDefaults.WML_FOLDER,
        dags_dir: str = ProjectDefaults.DAGS_FOLDER,
        operators_dir: str = ProjectDefaults.OPERATORS_FOLDER,
        _conf_file: str = ProjectDefaults.PROJECT_CONF,
        *args,
        **kwargs,
    ):
        """Creates a new Windmill Project
        
        Args:
            name (str): Name of the root project folder
            git_remote(str): Git remote URI
            wml_dir (str): Folder to store windmill WML files
            dags_dir (str): Folder to store generated YML DAG files
            operators_dir (str): Folder to store custom operator files
            conf_file (str, optional): Default project config filename. Defaults to ProjectDefaults.PROJECT_CONF.
        """
        super().__init__(*args, **kwargs)

        self.name = name
        self.git_remote = git_remote
        self.wml_dir = wml_dir
        self.dags_dir = dags_dir
        self.operators_dir = operators_dir
        self.conf_file = _conf_file

    @property
    def run_config(self):
        return self.subconfigs[RunConfig.config_key]

    @staticmethod
    def from_conf_file(filename=None):
        if not filename:
            filename = ProjectDefaults.PROJECT_CONF
        try:
            return ProjectConfig.with_config_file(filename)
        except Exception as e:
            raise InitError("This directory is not a valid windmill project") from e
