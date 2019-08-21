#Overview

Drag'n'drop web app to manage and create Airflow DAGs. The goal is to
have a Web UI that can generate YML Dag Definitions, integrating with
custom operators and potentially existing DAGs. YML DAGs can then be 
synced to a remote repo 

- Front end is built using Typescript React
- Back end is planned to be built using Flask on Python 3.7

## Front-End Features

- [x] Dynamic Operators
- [x] Menu Dropdowns
- [ ] Load Operators from App
- [ ] Format operator display into classes
- [ ] Search functionality for operators
- [ ] Implement DAG level properties
- [ ] Render arbitrary viewport windows for New/Save/Load etc
- [ ] New DAG Functionality
- [ ] Parameter Tooltips
- [ ] DAG renaming and save/load functionality
- [ ] Icons

## Back-End Features

- [ ] Generate Operator Lists
- [ ] Save/Load Windmill Files functionality
- [ ] Generate YML Airflow Specs
- [ ] Integrate with Git
- [ ] Get default values using inspect.getfullargspec
- [ ] Allow custom operators
- [ ] Backport existing Python DAGs to WMLs
- [ ] Allow YML updates to propogate to WMLs
- [ ] Allow user specified Airflow Version