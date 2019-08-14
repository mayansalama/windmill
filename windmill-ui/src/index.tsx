import { FlowChart, IChart } from "@mrblenny/react-flow-chart";
import * as actions from "@mrblenny/react-flow-chart/src/container/actions";
import { cloneDeep, mapValues } from "lodash";
import { FaWind } from "react-icons/fa";
import * as React from "react";
import { render } from "react-dom";
import styled from "styled-components";
import {
  DragAndDropSidebar,
  DropdownNavbar,
  Page,
  ResizablePanel,
  SelectedSidebar,
  Sidebar
} from "./components";
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
  flex: 1 1 auto;
  overflow: hidden;
`;

const navigation = {
  icon: <FaWind />,
  brand: { name: "Windmill", to: "/" },
  links: [
    { name: "File", to: "/" },
    { name: "View", to: "/" },
    { name: "About", to: "/" }
  ]
};

class App extends React.Component {
  public state = cloneDeep(chartSimple);

  public renderSelectedSidebar(chart: IChart, onDeleteKey: Function) {
    return <SelectedSidebar chart={chart} onDeleteKey={onDeleteKey} />;
  }

  public render() {
    const { icon, brand, links } = navigation;
    const chart = this.state;
    const stateActions = mapValues(actions, (func: any) => (...args: any) =>
      this.setState(func(...args))
    ) as typeof actions;

    return (
      <AppLayout>
        <Page>
          <DropdownNavbar icon={icon} brand={brand} links={links} />
        </Page>
        <Page>
          <ResizablePanel>
            <DragAndDropSidebar />
            <Content>
              <FlowChart chart={chart} callbacks={stateActions} />
            </Content>
            <SelectedSidebar
              chart={chart}
              onDeleteKey={stateActions.onDeleteKey}
            />
            ;
          </ResizablePanel>
        </Page>
      </AppLayout>
    );
  }
}

class Test extends React.Component {
  public render() {
    return (
      <div>
        <h1>ReactJS Resizable Panels</h1>
        <ResizablePanel>
          <div>
            This is the first panel. It will use the rest of the available
            space.
          </div>
          <div>This is the second panel. Starts with 300px.</div>
          <div>This is the third panel. Starts with 300px.</div>
        </ResizablePanel>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
