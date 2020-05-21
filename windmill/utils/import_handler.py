import os
import sys
import importlib
from types import ModuleType

from ..config.project_config import ProjectConfig


def import_str_as_module(code: str, name: str, doc: str = "") -> ModuleType:
    """Create a module from a string of Python code

    Arguments:
        code {str} -- code to create module from
        name {str} -- name of module

    Keyword Arguments:
        doc {str} -- Docstring of module (default: {""})

    Returns:
        ModuleType -- instantiated module
    """
    # TODO - add custom operators (dont add project to path - too many name conflicts)

    module = ModuleType(name, doc)

    exec(code) in module.__dict__
    return module


def import_dag_from_project(pyfile: str, config: ProjectConfig) -> ModuleType:
    """For a given project config, will import a python file into a 
    module object

    Arguments:
        pyfile {str} -- Filename to import from dags folder
        config {ProjectConfig} -- Config to define import paths

    Returns:
        ModuleType -- Imported module
    """

    # TODO - add custom operators (dont add project to path - too many name conflicts)
    mod_name = f"imported_dags.{pyfile.split('.py')[0]}"
    spec = importlib.util.spec_from_file_location(
        mod_name, os.path.join(config.dags_dir, pyfile)
    )
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)

    return mod
