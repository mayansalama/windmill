import {
  FlowChart,
  ICanvasOuterDefaultProps,
  IChart
} from "@mrblenny/react-flow-chart";
import * as actions from "@mrblenny/react-flow-chart/src/container/actions";
import * as localStorage from "local-storage";
import { cloneDeep, mapValues } from "lodash";
import * as React from "react";
import { render } from "react-dom";
import styled from "styled-components";
import { APIClient } from "./ApiClient";
import {
  AirflowNode,
  AirflowPanel,
  DropdownNavbar,
  IAirflowOperator,
  IAirflowOperatorProperties,
  Page,
  ResizablePanel,
  SelectedSidebar
} from "./components";
import * as MenuItems from "./components/Navbar/NavbarDropdowns";
import { emptyChart } from "./misc/exampleChartState";
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

const CanvasStyle = styled.div<ICanvasOuterDefaultProps>`
  position: relative;
  background-size: 10px 10px;
  background-color: white;
  background-image: linear-gradient(
      90deg,
      hsla(0, 10%, 0%, 0.05) 1px,
      transparent 0
    ),
    linear-gradient(180deg, hsla(0, 10%, 0%, 0.05) 1px, transparent 0);
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: not-allowed;
` as any;

export interface IAppState extends IChart {
  operators?: IAirflowOperator[];
}

class App extends React.Component<{}, IAppState> {
  apiClient = new APIClient();

  constructor(props) {
    super(props);
    this.state = localStorage.get("windmillChart") || cloneDeep(emptyChart);

    this.updateNodeProperties = this.updateNodeProperties.bind(this);
    this.refreshOperators = this.refreshOperators.bind(this);
  }

  public componentDidMount() {
    if (this.operators.length == 0) {
      this.refreshOperators();
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
        callback: () => (
          <MenuItems.FileDropdown getAppState={() => this.state} />
        )
      },
      {
        name: "View",
        callback: () => (
          <MenuItems.ViewDropdown getAppState={() => this.state} />
        )
      },
      {
        name: "Help",
        callback: () => (
          <MenuItems.HelpDropdown getAppState={() => this.state} />
        )
      }
    ]
  };

  public refreshOperators() {
    this.apiClient.getOperators().then(data => {
      this.setState(prevState => ({
        ...prevState,
        operators: data
      }));
    });
  }

  public get operators(): IAirflowOperator[] {
    return this.state.operators;
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

  public render() {
    const stateActions = mapValues(actions, (func: any) => (...args: any) =>
      this.setState(func(...args))
    ) as typeof actions;

    return (
      <AppLayout>
        <Page>
          <DropdownNavbar {...this.Navigation} />
        </Page>
        <Page>
          <ResizablePanel>
            <AirflowPanel
              operators={this.operators}
              refreshOperators={this.refreshOperators}
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
            <SelectedSidebar
              chart={this.state}
              onDeleteKey={stateActions.onDeleteKey}
              updateNodeProps={this.updateNodeProperties}
            />
          </ResizablePanel>
        </Page>
      </AppLayout>
    );
  }
}

render(<App />, document.getElementById("root"));
