import { IChart } from "@mrblenny/react-flow-chart";

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
