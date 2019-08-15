import { IChart, FlowChart } from "@mrblenny/react-flow-chart";
import * as actions from "@mrblenny/react-flow-chart/src/container/actions";
import { cloneDeep, mapValues } from "lodash";
import { FaWind } from "react-icons/fa";
import * as React from "react";
import styled from "styled-components";
import {
  AirflowNode,
  AirflowPanel,
  DropdownNavbar,
  IDropdownNavbarProps,
  Page,
  ResizablePanel,
  SelectedSidebar
} from "./components";
import { emptyChart } from "./misc/exampleChartState";
import { dummyOperators } from "./misc/exampleAirflowOperators";
import { render } from "react-dom";

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

const Navigation = {
  icon: <FaWind />,
  brand: { name: "Windmill", to: "/" },
  links: [
    { name: "File", to: "/" },
    { name: "View", to: "/" },
    { name: "About", to: "/" }
  ],
  dropdownHandlers: [{ name: "File", callback: this.renderFile }]
};

interface IAppState {
  chart: IChart;
}

class App extends React.Component
// <
//   { navigation: IDropdownNavbarProps },
//   IAppState
// > 
{
  public state = cloneDeep(emptyChart)

  // public constructor(props) {
  //   super(props);
  //   this.setState({
  //     chart: cloneDeep(emptyChart)
  //   });
  // }

  public renderFile() {}

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
          <DropdownNavbar {...Navigation} />
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
            ;
          </ResizablePanel>
        </Page>
      </AppLayout>
    );
  }
}

render(<App />, document.getElementById("root"));
