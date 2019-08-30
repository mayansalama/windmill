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
import { IAppState } from "../../";
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

export class MainPage extends React.Component<
  {
    actions: any;
    getAppState: Function;
    navigation: IDropdownNavbarProps;
    refreshOperators: Function;
    updateNodeProperties: Function;
    updateDag: Function;
  },
  {}
> {
  public render() {
    const {
      actions,
      getAppState,
      navigation,
      refreshOperators,
      updateNodeProperties,
      updateDag
    } = this.props;

    const appState: IAppState = getAppState();

    return (
      <AppLayout>
        <NavbarPage>
          <DropdownNavbar {...navigation} />
        </NavbarPage>
        <Page>
          <ResizablePanel>
            <SelectedSidebar
              appState={appState}
              onDeleteKey={actions.onDeleteKey}
              updateNodeProps={updateNodeProperties}
              updateDag={updateDag}
            />
            <Content>
              <FlowChart
                chart={appState}
                callbacks={actions}
                Components={{
                  NodeInner: AirflowNode,
                  CanvasOuter: CanvasStyle
                }}
              />
            </Content>
            <OperatorSidebar
              operators={appState.operators}
              refreshOperators={refreshOperators}
            />
          </ResizablePanel>
        </Page>
      </AppLayout>
    );
  }
}
