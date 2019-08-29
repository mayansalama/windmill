from collections import namedtuple

from marshmallow import fields, Schema

from ..constants import ProjectDefaults


class Project(Schema):
    # CLI Arguments
    name = fields.Str(
        default=ProjectDefaults.PROJECT_NAME, help="Name of the root project folder"
    )
    wml_dir = fields.Str(
        default=ProjectDefaults.WML_FOLDER, help="Folder to store windmill WML files"
    )
    dags_dir = fields.Str(
        default=ProjectDefaults.DAGS_FOLDER,
        help="Folder to store generated YML DAG files",
    )
    operators_dir = fields.Str(
        default=ProjectDefaults.OPERATORS_FOLDER,
        help="Folder to store custom operator files",
    )

    # Non CLI Arguments
    conf_file = fields.Str(
        default=ProjectDefaults.PROJECT_CONF,
        help="Project config file name",
        ignore_cli=True,
    )

    def load_to_obj(self, *args, **kwargs):
        """Runs Schema.load method, but converts the dictionary result
        into an object with named fields.
        
        Returns:
            ProjectObj: Instantiated object with the same fields as the parent schema
        """
        d = self.load(*args, **kwargs)
        ProjectObj = namedtuple("ProjectObj", d.keys())

        class DumpableProject(ProjectObj):
            def dump(self):
                return d

        return DumpableProject(*d.values())

    @staticmethod
    def to_cli_args():
        """Converts this config object into a DeCli arguments list. If a field
        has `ignore_cli=True` metadata then it will not be included. If not specified
        with arg_type the default type is assumed as string.

        TODO: Make generic (mixin or inherit from schema?)
        TODO: Implicit field typings (e.g. fields.Str -> str())
        
        Returns:
            List<dict>: List of command parameters 
        """
        return [
            {
                "name": f"--{f_name.replace('_', '-')}",
                "help": f_spec.metadata.get("help", ""),
                "default": f_spec.default,
                "type": f_spec.metadata.get("arg_type", str),
            }
            for f_name, f_spec in Project().fields.items()
        ]
