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
   1. Airflow is expected to be installed on the system
   2. Otherwise it can be packaged with windmill using `pip install airflow-windmill[airflow]`
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
- [ ] Switch nav menu to icons
- [ ] Make input/output nodes more clear
- [ ] Make save/load more efficient by removing non-essential values
- [ ] Check if file already exists on rename
- [ ] Prompt save if there are nodes on open
- [ ] Fix loss of state on refresh bug
- [ ] Put File details in File Browser
- [ ] Make Flask Backend URI configurable
- [ ] Add a last saved time to NavBar

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
- [ ] Move airflow dependency as extra
- [ ] ? Dedupe multi import operators - nothing preventing this but underlying issue is fixed
- [ ] Convert WML into Python DAG
- [ ] Get WML owner and last-modified details during wml list
- [ ] Allow custom operators
- [ ] Add defaults to CLI --help commands
- [ ] Strategy for Python Opjects (e.g. callables) - maybe import statement?
- [ ] Backport existing Python DAGs to WMLs
- [ ] Allow YML updates to propogate to WMLs

### Other features

- [ ] Validate on backend or front end or both?
- [ ] Doco

## Dev User Guide

To run as a dev:

1. Clone from git
2. Run `poetry install`
3. Run `windmill-dev start-backend`
4. Run `windmill-dev start-frontend`

## Future Usage Patterns

- Auto-sync for windmill project to git

## Deployment

```bash
cd scripts
sh build.sh {{PYPI_USER}} {{PYPI_PASS}}
```
