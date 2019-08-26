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
- [ ] Search functionality for operators
- [ ] Implement DAG level properties
- [ ] Render arbitrary viewport windows for New/Save/Load etc
- [ ] New DAG Functionality
- [ ] Parameter Tooltips
- [ ] DAG renaming and save/load functionality
- [ ] Icons

## Back-End Features

- [x] Generate Operator Lists
- [x] CLI to start Web and Front End 
- [ ] Save/Load Windmill Files functionality
- [ ] Generate YML Airflow Specs 
- [ ] Integrate with Git
- [ ] Get default values using inspect.getfullargspec
- [ ] Pull parameters from parent classes 
- [ ] Dedupe multi import operators
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
