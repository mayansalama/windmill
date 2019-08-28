import { IChart } from "@mrblenny/react-flow-chart";

import { IAirflowDag, IAirflowOperator, IAirflowNode } from "../components";

export interface IAppState extends IChart {
  operators?: IAirflowOperator[];
  dag: IAirflowNode;
}

export const defaultChart: IAppState = {
  offset: {
    x: -1000,
    y: -1000
  },
  nodes: {},
  links: {},
  selected: {},
  hovered: {},
  dag: null,
  operators: []
};
