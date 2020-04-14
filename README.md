# Windmill

[![Build Status](https://travis-ci.org/mayansalama/windmill.svg?branch=master)](https://travis-ci.org/mayansalama/windmill)

Drag'n'drop web app to manage and create Airflow DAGs. DAGs are described
usinga JSON "wml" file, which can be transpiled into a Python DAG file and 
pushed to a configured git repository.

- Front end is built using React on Typescript
- Back end is built using Flask on Python 3.6+

## Getting Started

1. Install with `pip install airflow-windmill`
   1. Airflow is expected to be installed on the system. This allows Windmill to run with arbitrary versions of Airflow
   2. Otherwise it can be packaged with windmill using `pip install airflow-windmill[airflow]`. The version is defined in `pyproject.toml`
2. Run `windmill init` to create a local Windmill project
3. `cd windmill-project`
4. Run `windmill run` from this folder to run the app locally

## MVP Required Features

### Front-End Features

- [x] Dynamic Operators
- [x] Menu Dropdowns
- [x] Load Operators from App
- [x] Format operator display into classes
- [x] Search functionality for operators
- [x] Basic operator level properties
- [x] Implement DAG level properties
- [x] New DAG Functionality
- [x] Parameter Tooltips
- [x] Render arbitrary viewport windows for New/Save/Load etc
- [x] Overwrite/Save prompt on New
- [x] DAG renaming and save functionality
- [x] Open dag from menu
- [x] Make save/load more efficient by removing non-essential values
- [x] Switch nav menu to icons 
- [x] Add convert DAG call
- [ ] Add hotkeys to menu functions
- [x] Make input/output nodes more clear
- [ ] Check if file already exists on rename
- [ ] Prompt save if there are nodes on open
- [x] Fix loss of state on refresh bug
- [ ] Put File details in File Browse
- [ ] Make Flask Backend URI configurable
- [ ] Add a last saved time to NavBar
- [ ] Add error handling to backend calls
- [ ] Only save local state if valid
- [ ] Add tests
- [ ] Get task descriptions from Operator list
- [ ] XSS and injection vulns? 
- [ ] Ctl+Shift+F FIXME

### Back-End Features

- [x] Generate Operator Lists
- [x] CLI to start Web and Front End
- [x] Generate DAG Spec
- [x] CLI to create new windmill project
- [x] CLI to start windmill from a windmill project
- [x] Implement windmill-dev start
- [x] Save/Load Windmill Files functionality
- [x] Get default values
- [x] Pull parameters from parent classes
- [x] Move airflow dependency as extra
- [x] Convert WML into Python DAG
- [x] API Endpoint to trigger WML -> DAG
- [x] Make sure that nodes are being put in right order using ports
- [ ] Edge cases for WML -> DAG
- [ ] Allow repeated/weird dag/task ids (e.g. 123)
- [ ] Get WML owner and last-modified details during wml list
- [ ] Allow custom operators
- [ ] Strategy for Python Opjects (e.g. callables) - allow either a import ref or an inline statement
- [ ] Backport existing Python DAGs to WMLs
- [ ] Allow DAG updates to propogate to WMLs (probably better to just always backport - consolidating would be a mess)
- [ ] Add tests for different airflow version
- [ ] Version lock travis tox and poetry version? 

### Other features

- [ ] Validate on backend or front end or both?
- [ ] Doco
- [ ] Add permission restrictions for valid tags 
- [ ] Only include dist folder from app in poetry build

## Dev User Guide

To run as a dev:

1. Clone from git
2. Run `poetry install -E airflow`
4. Run `npm install from windmill/http/app`
4. Run `windmill-dev start-frontend`
3. Run `windmill-dev start-backend`
5. Open `127.0.0.1:1234`

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
