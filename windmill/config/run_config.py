from marshmallow import Schema, fields

from .base_config import BaseConfig
from .project_config import ProjectConfig
from ..constants import ServerDefaults


class RunConfig(BaseConfig):
    schema = Schema.from_dict(
        {
            "port": fields.Int(missing=ServerDefaults.HOST_PORT, help="Bind port"),
            "hostname": fields.Str(
                missing=ServerDefaults.HOST_ADDRESS, help="Bind Address"
            ),
            "conf_file": fields.Str(
                missing=ServerDefaults.PROJECT_CONF,
                help="Name of config file in this directory",
            ),
        }
    )

    def __init__(
        self,
        port: int,
        hostname: str,
        conf_file: str,
        run_dev_server=False,
        *args,
        **kwargs
    ):
        """Wrapper around run-server
        
        Args:
            ...RunConfig.Schema
            run_dev_server (bool) : If True will run back-end with CORS on Flask (No Gunicorn)
        """
        self.port = port
        self.hostname = hostname
        self.conf_file = conf_file
        self.run_dev_server = run_dev_server

        self.project_conf = ProjectConfig.from_conf_file(self.conf_file)
