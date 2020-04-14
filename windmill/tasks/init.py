import logging
from os import mkdir, listdir
from os.path import join, exists

import yaml

from ..config.project_config import ProjectConfig
from ..exceptions import InitError


class CreateProject:
    def __init__(self, proj: ProjectConfig):
        """Creates a new project directory 
        
        Args:
            proj (Project): Project config object
        
        Raises:
            InitError: If project directory cannot be created
        """
        if exists(proj.name):
            if len(listdir(proj.name)) == 0:
                logging.info(f"Project directory  already exists...")
            else:
                raise InitError(f"Non-empty directory '{proj.name}' already exists.")
        else:
            logging.info(f"Creating project directory '{proj.name}'")
            mkdir(proj.name)

        logging.info(f"Creating project subfolders...")
        mkdir(join(proj.name, proj.wml_dir))
        mkdir(join(proj.name, proj.dags_dir))
        mkdir(join(proj.name, proj.operators_dir))

        logging.info(f"Creating project config file '{proj.conf_file}'")
        proj.to_config_file(join(proj.name, proj.conf_file))

        logging.info(f"Succesfully created project '{proj.name}'")
