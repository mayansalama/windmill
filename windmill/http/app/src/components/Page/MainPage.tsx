import React from "react";
import {
  AirflowNode,
  DropdownNavbar,
  IDropdownNavbarProps,
  NavbarPage,
  ResizablePanel,
  Page,
  SelectedSidebar,
  OperatorSidebar
} from "..";
import { App } from "../../";
import { CanvasStyle } from "../Theme";
import { FlowChart } from "@mrblenny/react-flow-chart";
import styled from "styled-components";

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

export class MainPage extends React.Component<{
  actions: any;
  getApp: Function;
}> {
  public render() {
    const { actions, getApp } = this.props;
    const app: App = getApp();

    const navigation: IDropdownNavbarProps = app.Navigation;
    const refreshOperators: Function = app.refreshOperators;
    const updateNodeProperties: Function = app.updateNodeProperties;
    const updateDag: Function = app.updateDag;

    return (
      <AppLayout>
        <NavbarPage>
          <DropdownNavbar {...{...navigation, filename: app.state.filename}} />
        </NavbarPage>
        <Page>
          <ResizablePanel>
            <SelectedSidebar
              appState={app.state}
              onDeleteKey={actions.onDeleteKey}
              updateNodeProps={updateNodeProperties}
              updateDag={updateDag}
            />
            <Content>
              <FlowChart
                chart={app.state}
                callbacks={actions}
                Components={{
                  NodeInner: AirflowNode,
                  CanvasOuter: CanvasStyle
                }}
              />
            </Content>
            <OperatorSidebar
              operators={app.state.operators}
              refreshOperators={refreshOperators}
            />
          </ResizablePanel>
        </Page>
      </AppLayout>
    );
  }
}
