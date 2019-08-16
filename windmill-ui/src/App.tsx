import { FlowChart, IChart } from "@mrblenny/react-flow-chart";
import * as actions from "@mrblenny/react-flow-chart/src/container/actions";
import { cloneDeep, mapValues } from "lodash";
import * as React from "react";
import ReactDOM, { render } from "react-dom";
import styled from "styled-components";
import {
  AirflowNode,
  AirflowPanel,
  DropdownNavbar,
  Page,
  ResizablePanel,
  SelectedSidebar
} from "./components";
import * as MenuItems from "./components/Navbar/NavbarDropdowns";
import { dummyOperators } from "./misc/exampleAirflowOperators";
import { emptyChart } from "./misc/exampleChartState";

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
  // The AppState has to extend, not include, the IChart or the dragndrop breaks (not sure why)
  closePopups?: boolean;
}

class App extends React.Component<{}, IAppState> {
  public Navigation = {
    icon: <div />,
    brand: { name: "Windmill", to: "/" },
    dropdownHandlers: [
      {
        name: "File",
        callback: () => <MenuItems.FileDropdown {...this.state} />
      },
      {
        name: "View",
        callback: () => <MenuItems.ViewDropdown {...this.state} />
      }
    ]
  };

  public state = cloneDeep(emptyChart);

  public renderSelectedSidebar(chart: IChart, onDeleteKey: Function) {
    return <SelectedSidebar chart={chart} onDeleteKey={onDeleteKey} />;
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
            <AirflowPanel operators={dummyOperators} />
            <Content>
              <FlowChart
                chart={this.state}
                callbacks={stateActions}
                Components={{
                  NodeInner: AirflowNode
                }}
              />
            </Content>
            <SelectedSidebar
              chart={this.state}
              onDeleteKey={stateActions.onDeleteKey}
            />
          </ResizablePanel>
        </Page>
      </AppLayout>
    );
  }
}

render(<App />, document.getElementById("root"));
