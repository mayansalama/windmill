# Windmill

[![Build Status](https://travis-ci.org/mayansalama/windmill.svg?branch=master)](https://travis-ci.org/mayansalama/windmill)

Drag'n'drop web app to manage and create Airflow DAGs. The goal is to
have a Web UI that can generate YML Dag Definitions, integrating with
custom operators and potentially existing DAGs. YML DAGs can then be
synced to a remote repo

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
- [ ] Make input/output nodes more clear
- [ ] Check if file already exists on rename
- [ ] Prompt save if there are nodes on open
- [x] Fix loss of state on refresh bug
- [ ] Put File details in File Browse
- [ ] Make Flask Backend URI configurable
- [ ] Add a last saved time to NavBar
- [ ] Add error handling to backend calls
- [ ] Add tests
- [ ] Get task descriptions from Operator list

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
- [ ] Edge cases for WML -> DAG
- [ ] Get WML owner and last-modified details during wml list
- [ ] Allow custom operators
- [ ] Add defaults to CLI --help commands
- [ ] Strategy for Python Opjects (e.g. callables) - allow either a import ref or an inline statement
- [ ] Backport existing Python DAGs to WMLs
- [ ] Allow DAG updates to propogate to WMLs
- [ ] Add tests for different airflow version

### Other features

- [ ] Validate on backend or front end or both?
- [ ] Doco
- [ ] Add permission restrictions for valid tags 

## Dev User Guide

To run as a dev:

1. Clone from git
2. Run `poetry install -E airflow`
3. Run `windmill-dev start-backend`
4. Run `windmill-dev start-frontend`

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
