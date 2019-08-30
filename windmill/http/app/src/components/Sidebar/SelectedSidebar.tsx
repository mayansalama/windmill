import * as React from "react";
import styled from "styled-components";
import { ISelectedOrHovered } from "@mrblenny/react-flow-chart";
import { IAirflowNode, AirflowNodeForm, AirflowDagParams } from "../";
import { BaseSidebar, SidebarTitle, Theme } from "../Theme";
import { IAppState } from "../..";

const Button = styled.div`
  margin: 30px;
  padding: 10px 15px;
  background: ${Theme.colors.brand};
  color: white;
  border-radius: 3px;
  text-align: center;
  transition: 0.3s ease all;
  cursor: pointer;
  &:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  &:active {
    background: #5682d2;
  }
`;

const P = styled.p`
  margin-left: 15px;
`;

const PropertiesDiv = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export class SelectedSidebar extends React.Component<{
  appState: IAppState;
  onDeleteKey: Function;
  updateNodeProps: Function;
  updateDag: Function;
}> {
  public renderNode(selected: ISelectedOrHovered) {
    const node: IAirflowNode = this.props.appState.nodes[selected.id];
    return (
      <BaseSidebar>
        <SidebarTitle>Operator Properties</SidebarTitle>
        <PropertiesDiv>
          <AirflowNodeForm
            node={node}
            updateNodeProps={this.props.updateNodeProps}
          />
          <br />
          <Button onClick={() => this.props.onDeleteKey()}>Delete</Button>
        </PropertiesDiv>
      </BaseSidebar>
    );
  }

  public render() {
    if (this.props.appState.selected.type === "node" || false) {
      return this.renderNode(this.props.appState.selected);
    }
    return (
      <BaseSidebar>
        <SidebarTitle>DAG Properties</SidebarTitle>
        <PropertiesDiv>
          <P>Click on an Operator Node to modify parameters</P>
          <AirflowDagParams
            dagProps={this.props.appState.dag}
            updateDagProps={this.props.updateDag}
          />
        </PropertiesDiv>
      </BaseSidebar>
    );
  }
}
