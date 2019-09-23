class ProjectDefaults:
    PROJECT_NAME = "windmill-project"
    PROJECT_CONF = "windmill.conf"
    WML_FOLDER = "wmls"
    DAGS_FOLDER = "dags"
    OPERATORS_FOLDER = "custom_operators"


class ServerDefaults:
    HOST_ADDRESS = "localhost"
    HOST_PORT = 8000
    PROJECT_CONF = ProjectDefaults.PROJECT_CONF
