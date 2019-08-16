import * as React from "react";
import styled, { ThemeConsumer } from "styled-components";
import { IAppState } from "../../App";
import { Theme } from "../Theme";
import ReactDOM = require("react-dom");

const MenuItem = styled.div`
  padding: 5px 7.5px;
  &:hover {
    box-shadow: 30px 30px 30px rgba(0, 0, 0, 0.5) inset;
  }
  &:active {
    background: #5682d2;
  }
`;

const DropdownBox = styled.div`
  display: flex;
  flex: 1 0 auto;
  position: absolute;
  background: ${Theme.colors.light};
  flex-direction: column;
  border: 3px solid ${Theme.colors.lightAccent};
  z-index: 10;
`;

const DropdownBoxItem = styled.div`
  justify-content: center;
  padding: 10px 30px;
  color: ${Theme.colors.dark};
  &:hover {
    background: ${Theme.colors.lightAccent};
  }
  min-width: 300px;
`;

const Sep = styled.hr`
  width: 80%;
  color: ${Theme.colors.dark};
  margin-left: auto;
  margin-right: auto;
`;

interface IDropdownItem {
  sep?: boolean;
  title?: string;
  callback?: Function;
}

class Dropdown extends React.Component<
  {
    title: string;
    items: IDropdownItem[];
  },
  { showDropdown: boolean }
> {
  node: React.RefObject<HTMLDivElement>;
  state = {
    showDropdown: false
  };
  constructor(props) {
    super(props);
    this.node = React.createRef();
  }

  public componentDidMount() {
    window.addEventListener("click", e => this.closeAfterUnrelatedClick(e));
  }

  public componentWillUnmount() {
    window.removeEventListener("click", e => this.closeAfterUnrelatedClick(e));
  }

  public closeDropdownBeforeCallback = (callback: Function) => {
    this.setState({ showDropdown: false });
    return callback();
  };

  public closeAfterUnrelatedClick = event => {
    console.log("hello");

    if (this.node.current && !this.node.current.contains(event.target)) {
      console.log("in here");
      this.setState({ showDropdown: false });
    }
  };

  public renderDropdown = () => {
    this.setState({ showDropdown: !this.state.showDropdown });
  };

  public render() {
    const DropdownButtons: any = () =>
      this.props.items.map((item: IDropdownItem) =>
        item.sep || false ? (
          <Sep />
        ) : (
          <DropdownBoxItem
            onClick={() => this.closeDropdownBeforeCallback(item.callback)}
          >
            {item.title}
          </DropdownBoxItem>
        )
      );

    return (
      <div ref={this.node}>
        <MenuItem onClick={this.renderDropdown}>{this.props.title}</MenuItem>
        {this.state.showDropdown ? (
          <DropdownBox>
            <DropdownButtons />
          </DropdownBox>
        ) : null}
      </div>
    );
  }
}

export class FileDropdown extends React.Component<IAppState> {
  public handleNew() {
    alert("new is not implemented");
  }

  public handleOpen() {
    alert("open is not implemented");
  }

  public render() {
    return (
      <Dropdown
        title="File"
        items={[
          { title: "New", callback: this.handleNew },
          { title: "Open", callback: this.handleOpen },
          { sep: true },
          { title: "Sep!", callback: () => {} }
        ]}
      />
    );
  }
}

export class ViewDropdown extends React.Component<IAppState> {
  public handleDagState() {
    alert("test");
  }

  public render() {
    return (
      <Dropdown
        title="View"
        items={[{ title: "DagState", callback: this.handleDagState }]}
      />
    );
  }
}
