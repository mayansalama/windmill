import { IAirflowOperatorParameter } from ".";

export interface IAirflowDagParameter extends IAirflowOperatorParameter {}

export interface IAirflowDag {
  description: string;
  parameters: IAirflowDagParameter[];
}
