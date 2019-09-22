import { actions, IChart } from "@mrblenny/react-flow-chart";
import * as localStorage from "local-storage";
import { cloneDeep, mapValues } from "lodash";
import * as React from "react";
import { render } from "react-dom";
import { APIClient } from "./ApiClient";
import {
  FileBrowser,
  RenameBox,
  IAirflowDag,
  IAirflowOperator,
  IAirflowOperatorProperties,
  MainPage,
  IDropdownNavbarProps
} from "./components";
import * as MenuItems from "./components/Navbar/NavbarDropdowns";
import { defaultChart } from "./misc/defaultChartState";
import { Icon, StyledSpinner } from "./misc/icon";

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

  constructor(props) {
    super(props);
    this.state = localStorage.get("windmillChart") || cloneDeep(defaultChart);

    this.newWml = this.newWml.bind(this);
    this.updateFilename = this.updateFilename.bind(this);
    this.updateNodeProperties = this.updateNodeProperties.bind(this);
    this.updateDag = this.updateDag.bind(this);
    this.refreshOperators = this.refreshOperators.bind(this);
    this.refreshDag = this.refreshDag.bind(this);
    this.toggleFileBrowser = this.toggleFileBrowser.bind(this);
    this.toggleRenameBox = this.toggleRenameBox.bind(this);
    this.saveWml = this.saveWml.bind(this);
  }

  public componentDidMount() {
    if (this.state.operators.length == 0) {
      this.refreshOperators();
    }
    if (!this.state.dag) {
      this.refreshDag();
    }
  }

  public componentDidUpdate() {
    localStorage.set("windmillChart", this.state);
  }

  public updateFilename(name: string) {
    this.setState(prevState => ({
      ...prevState,
      filename: name
    }));
  }

  public updateNodeProperties(
    key: string,
    newProps: IAirflowOperatorProperties
  ) {
    this.setState(prevState => ({
      ...prevState,
      nodes: {
        ...prevState.nodes,
        [key]: {
          ...prevState.nodes[key],
          ["properties"]: newProps
        }
      }
    }));

    localStorage.set("windmillChart", this.state);
  }

  public updateDag(newProps: IAirflowDag) {
    this.setState(prevState => ({
      ...prevState,
      dag: newProps
    }));

    localStorage.set("windmillChart", this.state);
  }

  public incLoading(inc = 1) {
    this.setState(prevState => ({
      ...prevState,
      isLoading: prevState.isLoading + inc
    }));
  }

  public openWml(filename: string) {
    this.incLoading();
    this.apiClient
      .getWml(filename)
      .then(data => {
        this.setState(prevState => ({
          ...prevState,
          ...data
        }));
      })
      .then(() => this.incLoading(-1));
  }

  public refreshOperators() {
    this.incLoading();
    this.apiClient
      .getOperators()
      .then(data => {
        this.setState(prevState => ({
          ...prevState,
          operators: data
        }));
      })
      .then(() => this.incLoading(-1));
  }

  public refreshDag() {
    this.incLoading();
    this.apiClient
      .getDagSpec()
      .then(data => {
        // Set values to defaults where applicable
        for (let i = 0; i < data.parameters.length; i++) {
          if (data.parameters[i].default) {
            data.parameters[i].value = data.parameters[i].default;
          }
        }
        this.setState(prevState => ({
          ...prevState,
          dag: data
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
    dropdownHandlers: [
      {
        name: "File",
        callback: () => <MenuItems.FileDropdown getApp={() => this} />
      },
      {
        name: "View",
        callback: () => <MenuItems.ViewDropdown getApp={() => this} />
      },
      {
        name: "Help",
        callback: () => <MenuItems.HelpDropdown getApp={() => this} />
      }
    ]
  };

  public newWml() {
    this.setState({
      ...defaultChart
    });
    this.refreshDag();
    this.refreshOperators();
  }

  public toggleFileBrowser() {
    this.setState(prevState => ({
      ...prevState,
      isFileBrowserOpen: !prevState.isFileBrowserOpen
    }));
  }

  public toggleRenameBox() {
    this.setState(prevState => ({
      ...prevState,
      isRenameBoxOpen: !prevState.isRenameBoxOpen
    }));
  }

  public saveWml() {
    // console.log(`${this.state.filename}.wml`)
    this.apiClient.saveWml(`${this.state.filename}.wml`, this.state);
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
                : ""
          }}
        >
          <MainPage actions={stateActions} getApp={() => this} />
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
