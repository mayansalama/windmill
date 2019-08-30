from abc import ABC, abstractstaticmethod

from marshmallow import Schema


class BaseConfig(ABC):
    """Helper class to manage CLI parsing and serialisation 
    """

    schema: Schema

    def dump(self):
        return self.schema().dump(self)

    @classmethod
    def load(cls, *args, **kwargs):
        """Runs Schema.load method, but converts the dictionary result
        into an object with named fields.
        
        Returns:
            ProjectObj: Instantiated object with the same fields as the parent schema
        """
        # Use schema to validate/translate
        data = cls.schema().load(kwargs, unknown="IGNORE")

        # Pass on additional params that aren't in the schema
        # This would include args that are not intended for the cli
        full_params = {**data, **{k: v for k, v in kwargs.items() if k not in data}}
        return cls(**full_params)

    @classmethod
    def to_cli_args(cls):
        """Converts this config object into a DeCli arguments list. If a field
        has `ignore_cli=True` metadata then it will not be included. If not specified
        with arg_type the default type is assumed as string.

        TODO: Implicit field typings (e.g. fields.Str -> str())
        
        Returns:
            List<dict>: List of command parameters 
        """
        return [
            {
                "name": f"--{f_name.replace('_', '-')}",
                "help": f_spec.metadata.get("help", ""),
                "default": f_spec.missing,
                "type": f_spec.metadata.get("arg_type", str),
            }
            for f_name, f_spec in cls.schema().fields.items()
        ]
