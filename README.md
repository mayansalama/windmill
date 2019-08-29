# Windmill

Drag'n'drop web app to manage and create Airflow DAGs. The goal is to
have a Web UI that can generate YML Dag Definitions, integrating with
custom operators and potentially existing DAGs. YML DAGs can then be
synced to a remote repo

- Front end is built using Typescript React
- Back end is built using Flask on Python 3.6+

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
- [ ] Render arbitrary viewport windows for New/Save/Load etc
- [ ] Overwrite/Save prompt on New
- [ ] DAG renaming and save/load functionality
- [ ] Fix loss of state on refresh bug
- [ ] Icons
- [ ] Pull PORT from Flask host

### Back-End Features

- [x] Generate Operator Lists
- [x] CLI to start Web and Front End
- [x] Generate DAG Spec
- [x] CLI to create new windmill project
- [x] CLI to start windmill from a windmill project
- [ ] Implement windmill-dev start
- [x] Save/Load Windmill Files functionality
- [ ] Generate YML Airflow Specs
- [ ] Validate incoming WMLs (is there a need for this?)
- [x] Get default values
- [x] Pull parameters from parent classes
- [?] Dedupe multi import operators - nothing preventing this but underlying issue is fixed
- [ ] Allow custom operators
- [ ] Add defaults to CLI --help commands
- [ ] Strategy for Python Opjects (e.g. callables) - maybe import statement?
- [ ] Backport existing Python DAGs to WMLs
- [ ] Allow YML updates to propogate to WMLs
- [ ] Allow user specified Airflow Version - isolate to docker or something so we can run 2.7 if we want?

## MVP Usage Pattern

To run as a user:

1. Install with `pip install airflow-windmill`
2. Run `windmill init` to create a local Windmill project
3. Run `windmill run` from this folder to run the app locally

To run as a dev:

1. Clone from git
2. Run `poetry install`
3. ?Run `windmill-dev install-node-depts`
4. Run `windmill-dev start` to start a flask server and use parcel to serve frontend

## Future Usage Patterns

- Auto-sync for windmill project to git

## Getting Started

This package can be installed and run using Pip:

```
pip install git+git://github.com/mayansalama/windmill.git
```
