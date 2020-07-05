import os
import tempfile
from unittest import TestCase

from windmill.config.project_config import ProjectConfig
from windmill.exceptions import DagHandlerValidationError
from windmill.models.schemas.app_schemas import MinimalWmlSchema
from windmill.models.dags.dag_handler import (
    DagHandler,
    DagFileHandler,
    TaskHandler,
    Links,
)
from windmill.tasks.init import CreateProject

from . import test_datafiles


class Fixture(TestCase):
    def setUp(self):
        self.tmpdir = tempfile.TemporaryDirectory()
        os.chdir(self.tmpdir.name)

        self.conf = ProjectConfig.from_conf_file()
        CreateProject(self.conf)

        os.chdir(os.path.join(self.tmpdir.name, self.conf.name))

        self.testfile = "valid.py"
        with open(os.path.join(self.conf.dags_dir, self.testfile), "w+") as f:
            f.write(test_datafiles[self.testfile])
        return super().setUp()

    def tearDown(self):
        self.tmpdir.cleanup()


class TestDagToDagHandler(Fixture):
    def test_valid_pyfile(self):
        dag_file_handler = DagFileHandler(self.testfile, self.conf)
        dag = dag_file_handler.dag

        # assert len(dags) == 1
        assert dag.dag_id == "ValidDag"
