from ..config.run_config import RunConfig
from ..http.api.endpoints import build_app


class StartWebserver:
    def __init__(self, conf: RunConfig):
        app = build_app(conf.project_conf, dev_server=conf.run_dev_server)

        app.run(host=conf.hostname, port=conf.port)
