import datetime
from dateutil.tz import tzutc

from airflow.models.dag import DAG
from airflow.operators.bash_operator import BashOperator
from airflow.operators.bash_operator import BashOperator


valid_dag = DAG(
    dag_id="ValidDag",
    description="This is a valid test dag",
    start_date=datetime.datetime(2020, 5, 20, 0, 0),
)


task1 = BashOperator(bash_command="echo 1", task_id="Task1", dag=valid_dag)
task2 = BashOperator(bash_command='echo "2"', task_id="Task2", dag=valid_dag)


task1 >> task2
