# Windmill

![Tests](https://github.com/mayansalama/windmill/workflows/Tests/badge.svg)


Drag'n'drop web app to manage and create Airflow DAGs. DAGs are described
usinga JSON "wml" file, which can be transpiled into a Python DAG file and 
pushed to a configured git repository.

- Front end is built using React on Typescript
- Back end is built using Flask on Python 3.6+

## Getting Started

1. python3 -V  # 3.6 and 3.7 should both be fine
2. If on *nix, `sudo apt-get install python3-venv`
3. python3 -m venv venv
4. source venv/bin/activate
5. Install with `pip install 'airflow-windmill'`
   1. Airflow is expected to be installed on the system. This allows Windmill to run with arbitrary versions of Airflow
   2. Otherwise it can be packaged with windmill using `pip install 'airflow-windmill[airflow]'`. The version is defined in `pyproject.toml`
6. Run `windmill init` to create a local Windmill project
7. `cd windmill-project`
8. Run `windmill run` from this folder to run the app locally
9. Navigate to 127.0.0.1:8000

## MVP 

For progress on MVP see https://github.com/mayansalama/windmill/projects/1

## Dev User Guide

To run as a dev:

1. Clone from git
2. Run `curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python`
3. Run `source $HOME/.poetry/env`
4. Activate your python virtualenv of choice
5. Run `poetry install -E airflow`
6. Run `npm --prefix ./windmill/http/app install ./windmill/http/app`
7. Run `windmill-dev start-frontend`
8. Run `windmill-dev start-backend`
9. Open `127.0.0.1:1234`

## Run Python Tests

Expects Tox and Poetry to be available on path

```
pyenv install 3.6.5 3.7.7
pyenv local 3.6.5 3.7.7
tox
```

## Future Usage Patterns

- Auto-sync for windmill project to git

## Deployment

Deployment to PyPi is managed using Travis and should be done in the following steps:

1. Run `poetry version {patch|minor|major}`
2. Increment the version number in `windmill/__init__.py`
3. Commit and merge code into the master branch
4. Ensure that the travis build is green
5. Create a git tag for the new build
6. Push the tag to origin
