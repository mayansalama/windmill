class ProjectDefaults:
    PROJECT_NAME = "windmill-project"
    PROJECT_CONF = "windmill.yml"
    WML_FOLDER = "wmls"
    DAGS_FOLDER = "dags"
    OPERATORS_FOLDER = "custom_operators"


class ServerDefaults:
    HOST_ADDRESS = "localhost"
    HOST_PORT = 8000
    PROJECT_CONF = ProjectDefaults.PROJECT_CONF


class GraphConstants:
    NODE_HEIGHT = 80
    NODE_WIDTH = 200
    NODE_SPACING_FACTOR = 2

    ORIENTATION = 0
    OFFSET_X = -1000
    OFFSET_Y = -1000
