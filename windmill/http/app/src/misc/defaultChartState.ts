import { IAppState } from "..";

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
  operators: [],
  isLoading: 0,
  isFileBrowserOpen: false,
  isRenameBoxOpen: false,
  filename: "Untitled"
};
