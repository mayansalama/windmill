import { FlowChart, IChart } from "@mrblenny/react-flow-chart";
import * as actions from "@mrblenny/react-flow-chart/src/container/actions";
import { cloneDeep, mapValues } from "lodash";
import * as React from "react";
import { render } from "react-dom";
import styled from "styled-components";
import { DragAndDropSidebar, Page, SelectedSidebar, Toolbar } from "./components";
import { chartSimple } from "./misc/exampleChartState";

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
  flex: 1;
  overflow: hidden;
`;

class App extends React.Component {
  public state = cloneDeep(chartSimple);

  public renderSelectedSidebar(chart: IChart, onDeleteKey: Function) {
    return <SelectedSidebar chart={chart} onDeleteKey={onDeleteKey} />;
  }

  public render() {
    const chart = this.state;
    const stateActions = mapValues(actions, (func: any) => (...args: any) =>
      this.setState(func(...args))
    ) as typeof actions;

    return (
      <AppLayout>
        <Toolbar />
        <Page>
          <DragAndDropSidebar />
          <Content>
            <FlowChart chart={chart} callbacks={stateActions} />
          </Content>
          {this.renderSelectedSidebar(chart, stateActions.onDeleteKey)}
        </Page>
      </AppLayout>
    );
  }
}

render(<App />, document.getElementById("root"));
