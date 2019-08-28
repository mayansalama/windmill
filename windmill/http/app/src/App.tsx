import { FlowChart, IChart } from "@mrblenny/react-flow-chart";
import * as actions from "@mrblenny/react-flow-chart/src/container/actions";
import * as localStorage from "local-storage";
import { cloneDeep, mapValues } from "lodash";
import * as React from "react";
import { render } from "react-dom";
import styled from "styled-components";
import { APIClient } from "./ApiClient";
import { CanvasStyle } from "./components/Theme";
import {
  AirflowNode,
  DropdownNavbar,
  IAirflowDag,
  IAirflowOperator,
  IAirflowOperatorProperties,
  NavbarPage,
  OperatorSidebar,
  Page,
  ResizablePanel,
  SelectedSidebar
} from "./components";
import * as MenuItems from "./components/Navbar/NavbarDropdowns";
import { defaultChart } from "./misc/defaultChartState";
import { Icon } from "./misc/icon";

const AppLayout = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 100vw;
  max-height: 100vh;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  overflow: hidden;
`;

export interface IAppState extends IChart {
  operators?: IAirflowOperator[];
  dag?: IAirflowDag;
}

class App extends React.Component<{}, IAppState> {
  apiClient = new APIClient();

  constructor(props) {
    super(props);
    this.state = localStorage.get("windmillChart") || cloneDeep(defaultChart);

    this.newDag = this.newDag.bind(this);
    this.updateNodeProperties = this.updateNodeProperties.bind(this);
    this.updateDag = this.updateDag.bind(this);
    this.refreshOperators = this.refreshOperators.bind(this);
    this.refreshDag = this.refreshDag.bind(this);
  }

  public componentDidMount() {
    if (this.operators.length == 0) {
      this.refreshOperators();
    }
    if (!this.dag) {
      this.refreshDag();
    }
  }

  public componentDidUpdate() {
    localStorage.set("windmillChart", this.state);
  }

  public Navigation = {
    icon: <Icon />,
    brand: { name: "Windmill", to: "/" },
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

  public newDag() {
    this.setState({
      ...defaultChart
    });
  }

  public refreshOperators() {
    this.apiClient.getOperators().then(data => {
      this.setState(prevState => ({
        ...prevState,
        operators: data
      }));
    });
  }

  public refreshDag() {
    this.apiClient.getDagSpec().then(data => {
      this.setState(prevState => ({
        ...prevState,
        dag: data
      }));
    });
  }

  public get operators(): IAirflowOperator[] {
    return this.state.operators;
  }

  public get dag(): IAirflowDag {
    return this.state.dag;
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
  }

  public updateDag(newProps: IAirflowDag) {
    this.setState(prevState => ({
      ...prevState,
      dag: newProps
    }));
  }

  public render() {
    const stateActions = mapValues(actions, (func: any) => (...args: any) =>
      this.setState(func(...args))
    ) as typeof actions;

    return (
      <AppLayout>
        <NavbarPage>
          <DropdownNavbar {...this.Navigation} />
        </NavbarPage>
        <Page>
          <ResizablePanel>
            <SelectedSidebar
              appState={this.state}
              onDeleteKey={stateActions.onDeleteKey}
              updateNodeProps={this.updateNodeProperties}
              updateDag={this.updateDag}
            />
            <Content>
              <FlowChart
                chart={this.state}
                callbacks={stateActions}
                Components={{
                  NodeInner: AirflowNode,
                  CanvasOuter: CanvasStyle
                }}
              />
            </Content>
            <OperatorSidebar
              operators={this.operators}
              refreshOperators={this.refreshOperators}
            />
          </ResizablePanel>
        </Page>
      </AppLayout>
    );
  }
}

render(<App />, document.getElementById("root"));
