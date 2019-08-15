import * as React from "react";
import styled from "styled-components";
import { IChart } from "@mrblenny/react-flow-chart";
import { Sidebar } from ".";
import { SidebarTitle, Theme } from "../Theme";

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
    return (
      <Sidebar>
        <SidebarTitle>Node Properties</SidebarTitle>
        {selected.type ? (
          <Message>
            <div>Type: {selected.type}</div>
            <div>ID: {this.props.chart.selected.id}</div>
            {selected.type === "node" ? <div>Node Selected</div> : null}
            <br />
            <Button onClick={() => this.props.onDeleteKey()}>Delete</Button>
          </Message>
        ) : (
          <Message>Click on a Node, Port or Link</Message>
        )}
      </Sidebar>
    );
  }
}
