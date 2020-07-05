import { IAppState } from "..";

export const defaultChart: IAppState = {
  offset: {
    x: 0,
    y: 0,
  },
  scale: 1,
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
