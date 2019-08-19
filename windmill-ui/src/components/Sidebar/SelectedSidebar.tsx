import * as React from "react";
import styled from "styled-components";
import { IChart, ISelectedOrHovered } from "@mrblenny/react-flow-chart";
import { IAirflowNode, AirflowNodeForm } from "../";
import { SidebarTitle, Theme, BaseSidebar } from "../Theme";
import { FaBars, FaTimes } from "react-icons/fa";

const BurgerSplit = styled.div`
  min-width: 400px;
`;

const BurgerText = styled.div`
  float: left;
`;

const BurgerButton = styled.div`
  color: ${Theme.colors.brand};
  border-radius: 20px;
  float: right;
  transition: 0.3s ease all;
  cursor: pointer;
  &:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  &:active {
    background: #5682d2;
  }
`;

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
  public state = {
    isOpen: true
  };

  public toggleSidebar = () => {
    const open = !this.state.isOpen;
    this.setState({
      isOpen: open
    });
  };

  public renderTitle(title: string) {
    return (
      <SidebarTitle>
        <BurgerSplit>
          <BurgerText>{title}</BurgerText>
          <BurgerButton onClick={() => this.toggleSidebar()}>
            <FaTimes />
          </BurgerButton>
        </BurgerSplit>
      </SidebarTitle>
    );
  }

  public renderContent(selected: ISelectedOrHovered) {
    if (selected.type === "node" || false) {
      const node: IAirflowNode = this.props.chart.nodes[selected.id];
      return (
        <div>
          {this.renderTitle("Node Properties")}
          <Message>
            <div>Type: {selected.type}</div>
            <div>Name: {node.properties.name}</div>
            <AirflowNodeForm node={node} />
            <br />
            <Button onClick={() => this.props.onDeleteKey()}>Delete</Button>
          </Message>
        </div>
      );
    }
    return (
      <div>
        {this.renderTitle("Chart Properties")}
        <Message>Click on a Node, Port or Link</Message>
      </div>
    );
  }

  public render() {
    return this.state.isOpen ? (
      this.renderContent(this.props.chart.selected)
    ) : (
      <BurgerButton
        onClick={() => this.toggleSidebar()}
        style={{ padding: `7.5px 10px` }}
      >
        <FaBars />
      </BurgerButton>
    );
  }
}
