# Windmill

Drag'n'drop web app to manage and create Airflow DAGs. The goal is to
have a Web UI that can generate YML Dag Definitions, integrating with
custom operators and potentially existing DAGs. YML DAGs can then be 
synced to a remote repo 

- Front end is built using Typescript React
- Back end is planned to be built using Flask on Python 3.7

## Front-End Features

- [x] Dynamic Operators
- [x] Menu Dropdowns
- [x] Load Operators from App
- [x] Format operator display into classes
- [x] Search functionality for operators
- [x] Basic operator level properties
- [x] Implement DAG level properties
- [ ] New DAG Functionality
- [ ] Render arbitrary viewport windows for New/Save/Load etc
- [ ] Parameter Tooltips
- [ ] DAG renaming and save/load functionality
- [ ] Icons

## Back-End Features

- [x] Generate Operator Lists
- [x] CLI to start Web and Front End 
- [x] Generate DAG Spec
- [ ] Save/Load Windmill Files functionality
- [ ] Generate YML Airflow Specs 
- [ ] Integrate with Git
- [x] Get default values 
- [x] Pull parameters from parent classes 
- [?] Dedupe multi import operators - nothing preventing this but underlying issue is fixed
- [ ] Allow custom operators
- [ ] Strategy for Python Opjects (e.g. callables) - maybe import statement?
- [ ] Backport existing Python DAGs to WMLs
- [ ] Allow YML updates to propogate to WMLs 
- [ ] Allow user specified Airflow Version - isolate to docker or something so we can run 2.7 if we want?

## Getting Started 

This package can be installed and run using Pip:

```
pip install git+git://github.com/mayansalama/windmill.git
```
