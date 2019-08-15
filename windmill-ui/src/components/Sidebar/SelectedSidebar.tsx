import * as React from "react";
import styled from "styled-components";
import { IChart } from "@mrblenny/react-flow-chart";
import { Sidebar } from ".";
import { IAirflowNode } from "../";
import { SidebarTitle, Theme } from "../Theme";
import { AirflowNode } from "../Airflow";

const Message = styled.div`
  margin: 10px;
  padding: 10px;
  line-height: 1.4em;
`;

const Button = styled.div`
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

export class SelectedSidebar extends React.Component<{
  chart: IChart;
  onDeleteKey: Function;
}> {
  public render() {
    const selected = this.props.chart.selected;

    if (selected.type === "node" || false) {
      const node: IAirflowNode = this.props.chart.nodes[selected.id];
      return (
        <Sidebar>
          <SidebarTitle>Node Properties</SidebarTitle>
          <Message>
            <div>Type: {selected.type}</div>
            <div>ID: {this.props.chart.selected.id}</div>
            <AirflowNode node={node} />
            <br />
            <Button onClick={() => this.props.onDeleteKey()}>Delete</Button>
          </Message>
        </Sidebar>
      );
    }
    return (
      <Sidebar>
        <SidebarTitle>Node Properties</SidebarTitle>
        <Message>Click on a Node, Port or Link</Message>
      </Sidebar>
    );
  }
}
