import { actions, IChart } from "@mrblenny/react-flow-chart";
import * as localStorage from "local-storage";
import { cloneDeep, mapValues } from "lodash";
import * as React from "react";
import { render } from "react-dom";
import { FaFile, FaSave, FaFolderOpen, FaProjectDiagram } from "react-icons/fa";
import SaveIcon from "../assets/save-icon.png";
import { APIClient } from "./ApiClient";
import {
  FileBrowser,
  RenameBox,
  IAirflowDag,
  IAirflowOperator,
  IAirflowOperatorProperties,
  MainPage,
  IDropdownNavbarProps,
} from "./components";
import * as MenuItems from "./components/Navbar/NavbarDropdowns";
import { defaultChart } from "./misc/defaultChartState";
import { Icon, StyledSpinner } from "./misc/icon";
import "./index.css";

export interface IAppState extends IChart {
  filename?: string;
  operators?: IAirflowOperator[];
  dag?: IAirflowDag;
  isLoading?: number;
  isFileBrowserOpen?: boolean;
  isRenameBoxOpen?: boolean;
}

export class App extends React.Component<{}, IAppState> {
  apiClient = new APIClient();

  constructor(props: Readonly<{}>) {
    super(props);
    // FIXME: If localstorage is corrupted then this won't stop spinning
    this.state = localStorage.get("windmillChart") || cloneDeep(defaultChart);
    // this.state = cloneDeep(defaultChart);

    this.convertToDag = this.convertToDag.bind(this);
    this.newWml = this.newWml.bind(this);
    this.refreshOperators = this.refreshOperators.bind(this);
    this.refreshDag = this.refreshDag.bind(this);
    this.toggleFileBrowser = this.toggleFileBrowser.bind(this);
    this.toggleRenameBox = this.toggleRenameBox.bind(this);
    this.saveWml = this.saveWml.bind(this);
    this.updateFilename = this.updateFilename.bind(this);
    this.updateNodeProperties = this.updateNodeProperties.bind(this);
    this.updateDag = this.updateDag.bind(this);
  }

  public componentDidMount() {
    if (this.state.operators.length == 0) {
      this.refreshOperators();
    }
    if (!this.state.dag) {
      this.refreshDag();
    }
  }

  cleanState = (state: IAppState) => {
    const x = {
      ...state,
      nodes: mapValues(state.nodes, (node) => {
        return {
          ...node,
          position: {
            x: node.position.x,
            y: node.position.y,
          },
        };
      }),
    };
    x.offset = {
      x: x.offset.x,
      y: x.offset.y,
    };
    return x;
  };

  public saveStateToLocal() {
    localStorage.set("windmillChart", this.cleanState(this.state));
  }

  public componentDidUpdate() {
    this.saveStateToLocal();
  }

  public updateFilename(name: string) {
    this.setState((prevState) => ({
      ...prevState,
      filename: name,
    }));
  }

  public updateNodeProperties(
    key: string,
    newProps: IAirflowOperatorProperties
  ) {
    this.setState((prevState) => ({
      ...prevState,
      nodes: {
        ...prevState.nodes,
        [key]: {
          ...prevState.nodes[key],
          ["properties"]: newProps,
        },
      },
    }));

    this.saveStateToLocal();
  }

  public updateDag(newProps: IAirflowDag) {
    this.setState((prevState) => ({
      ...prevState,
      dag: newProps,
    }));

    this.saveStateToLocal();
  }

  public incLoading(inc = 1) {
    this.setState((prevState) => ({
      ...prevState,
      isLoading: prevState.isLoading + inc,
    }));
  }

  public openWml(filename: string) {
    this.incLoading();
    this.apiClient
      .getWml(filename)
      .then((data) => {
        this.setState((prevState) => ({
          ...prevState,
          ...data,
        }));
      })
      .then(() => {
        this.incLoading(-1);
        this.toggleFileBrowser();
      });
  }

  public refreshOperators() {
    this.incLoading();
    this.apiClient
      .getOperators()
      .then((data) => {
        this.setState((prevState) => ({
          ...prevState,
          operators: data,
        }));
      })
      .then(() => this.incLoading(-1));
  }

  public refreshDag() {
    this.incLoading();
    this.apiClient
      .getDagSpec()
      .then((data) => {
        // Set values to defaults where applicable
        for (let i = 0; i < data.parameters.length; i++) {
          if (data.parameters[i].default) {
            data.parameters[i].value = data.parameters[i].default;
          }
        }
        this.setState((prevState) => ({
          ...prevState,
          dag: data,
        }));
      })
      .then(() => this.incLoading(-1));
  }

  //////////////////////////////////////////////////
  // Navigation and event handlers
  //////////////////////////////////////////////////

  public Navigation: IDropdownNavbarProps = {
    icon: <Icon />,
    brand: { name: "Windmill", to: "/" },
    renameHandler: () => this.toggleRenameBox(),
    buttons: [
      {
        tooltip: "New WML",
        icon: <FaFile />,
        callback: () => this.newWml(),
      },
      {
        tooltip: "Save WML",
        icon: <FaSave />,
        callback: () => this.saveWml(),
      },
      {
        tooltip: "Open WML",
        icon: <FaFolderOpen />,
        callback: () => this.toggleFileBrowser(),
      },
      {
        tooltip: "Convert to Python DAG",
        icon: <FaProjectDiagram />,
        callback: () => this.convertToDag(),
      },
    ],
    // Uncomment to include
    // FIXME: include in a debug mode?
    dropdownHandlers: [
      // {
      //   name: "File",
      //   callback: () => <MenuItems.FileDropdown getApp={() => this} />,
      // },
      // {
      //   name: "Help",
      //   callback: () => <MenuItems.HelpDropdown getApp={() => this} />,
      // },
      {
        name: "Debug",
        callback: () => <MenuItems.ViewDropdown getApp={() => this} />,
      },
    ],
  };

  public newWml() {
    this.setState({
      ...defaultChart,
    });
    this.refreshDag();
    this.refreshOperators();
  }

  public toggleFileBrowser() {
    this.setState((prevState) => ({
      ...prevState,
      isFileBrowserOpen: !prevState.isFileBrowserOpen,
    }));
  }

  public toggleRenameBox() {
    this.setState((prevState) => ({
      ...prevState,
      isRenameBoxOpen: !prevState.isRenameBoxOpen,
    }));
  }

  public saveWml() {
    // FIXME: Can't include position as react-flow-chart nested state here
    const { filename, dag, nodes, links } = this.cleanState(this.state);
    const persistentState = { filename, dag, nodes, links };

    this.apiClient.saveWml(`${this.state.filename}.wml`, persistentState);
  }

  public convertToDag() {
    // FIXME: Can't include position as react-flow-chart nested state here
    const { filename, dag, nodes, links } = this.cleanState(this.state);
    const persistentState = { filename, dag, nodes, links };

    this.apiClient.convertToDag(`${this.state.filename}.wml`, persistentState);
  }

  //////////////////////////////////////////////////
  // Render Methods
  //////////////////////////////////////////////////

  public render() {
    const stateActions = mapValues(actions, (func: any) => (...args: any) =>
      this.setState(func(...args))
    ) as typeof actions;

    if (this.state.isLoading > 0 || false) {
      return (
        <div style={{ position: "absolute", top: "45%", left: "45%" }}>
          <StyledSpinner style={{ width: "10vh", height: "10vh" }}>
            <Icon />
          </StyledSpinner>
        </div>
      );
    }

    return (
      <div>
        {this.state.isFileBrowserOpen ? (
          <FileBrowser getApp={() => this} />
        ) : (
          <div />
        )}
        {this.state.isRenameBoxOpen ? (
          <RenameBox getApp={() => this} />
        ) : (
          <div />
        )}
        <div
          style={{
            filter:
              this.state.isFileBrowserOpen || this.state.isRenameBoxOpen
                ? "opacity(0.3)"
                : "",
          }}
        >
          <MainPage actions={stateActions} getApp={() => this} />
        </div>
      </div>
    );
  }
}

// Icon
function IconSave() {
  return (
    <svg
      width="32"
      height="34"
      version="1.1"
      viewBox="0 0 210 297"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="Arrow1Lstart" overflow="visible" orient="auto">
          <path
            transform="scale(.8) translate(12.5)"
            d="m0 0 5-5-17.5 5 17.5 5-5-5z"
            fill-rule="evenodd"
            stroke="#FFF"
            stroke-width="5pt"
          />
        </marker>
      </defs>
      <g transform="translate(186.41 131.22)" stroke="#000">
        <path
          transform="scale(.26458)"
          d="m-404.69 223.19h-133.37c-24.288 0-43.842-19.553-43.842-43.842v-448.38c0-24.288 19.553-43.842 43.842-43.842v0h448.38c24.288 0 43.842 19.553 43.842 43.842v448.38c0 24.288-19.556 44.175-43.842 43.842l-133.37-1.83"
          fill="none"
          stroke-linecap="round"
          stroke-width="110.2"
          // style="paint-order:normal"
        />
        <path
          d="m-83.065 6.6142 0.042561 108.27"
          fill="none"
          marker-mid="url(#Arrow1Lstart)"
          stroke-width="12.6458"
        />
        <path
          d="m-69.33 114.88-13.692 23.716-13.692-23.716h13.692z"
          stroke-linecap="round"
          stroke-width="12.6458"
          // style="paint-order:normal"
        />
      </g>
    </svg>
  );
}

render(<App />, document.getElementById("root"));
