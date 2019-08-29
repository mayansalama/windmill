import os
import tempfile
from unittest import TestCase

from windmill.cli.cli import get_parser, Cli
from windmill.exceptions import InitError


cli_parser = get_parser(Cli.get_cli_spec())


class TestCli(TestCase):
    def test_init_empty_folder(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            os.chdir(tmpdir)
            assert os.getcwd() == tmpdir
            assert not os.path.exists("test")

            args = cli_parser.parse_args(["init", "--name", "test"])
            args.func(**vars(args))
            assert os.path.exists("test")

    def test_init_non_empty_folder(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            os.chdir(tmpdir)
            assert os.getcwd() == tmpdir
            assert not os.path.exists("test")

            # We can create a project in an existing dir
            os.mkdir("test")
            args = cli_parser.parse_args(["init", "--name", "test"])
            args.func(**vars(args))
            assert os.path.exists("test")

            # But only if it is empty
            args = cli_parser.parse_args(["init", "--name", "test"])
            exc = args.func(**vars(args))
            assert type(exc) == InitError
