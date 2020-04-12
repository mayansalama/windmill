from doccli import ConfigUtil

from ..constants import ServerDefaults


class RunConfig(ConfigUtil):
    command_name = "run"
    config_key = "webserver.config"

    @property
    def project_conf(self):
        from .project_config import ProjectConfig
        return ProjectConfig.from_conf_file(self.conf_file)            

    def __init__(
        self,
        port: int = ServerDefaults.HOST_PORT,
        hostname: str = ServerDefaults.HOST_ADDRESS,
        conf_file: str = ServerDefaults.PROJECT_CONF,
        _run_dev_server=False,
    ):
        """Serve Windmill from a windmill project
        
        Args:
            port (int): Bind Port
            hostname (str): Bind address 
            conf_file (str): Name of config file in this directory
            _run_dev_server (bool, optional): If True will run back-end with 
                                              CORS on Flask (No Gunicorn). 
                                              Defaults to False.
        """
        self.port = port
        self.hostname = hostname
        self.conf_file = conf_file
        self.run_dev_server = _run_dev_server
