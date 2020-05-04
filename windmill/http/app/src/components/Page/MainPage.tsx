import React from "react";
import {
  AirflowNode,
  DropdownNavbar,
  IDropdownNavbarProps,
  NavbarPage,
  ResizablePanel,
  Page,
  OperatorPort,
  SelectedSidebar,
  OperatorSidebar,
} from "..";
import { App } from "../../";
import { CanvasStyle } from "../Theme";
import { FlowChart } from "@mrblenny/react-flow-chart";
import styled from "styled-components";
import ReactTooltip from "react-tooltip";

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

const StyledTooltip = styled(ReactTooltip)`
  max-width: 300px;
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
          <DropdownNavbar
            {...{ ...navigation, filename: app.state.filename }}
          />
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
                  CanvasOuter: CanvasStyle,
                  Port: OperatorPort,
                }}
                config={{
                  validateLink: ({
                    linkId,
                    fromNodeId,
                    fromPortId,
                    toNodeId,
                    toPortId,
                    chart,
                  }): boolean => {
                    // no links between same node
                    if (
                      fromNodeId === toNodeId
                    )
                      return false;
                    return true;
                  },
                }}
              />
            </Content>
            <OperatorSidebar
              operators={app.state.operators}
              refreshOperators={refreshOperators}
            />
          </ResizablePanel>
          <StyledTooltip effect="solid" place="right" />
        </Page>
      </AppLayout>
    );
  }
}
