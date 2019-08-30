import * as React from "react";
import styled from "styled-components";
import {
  FaSync,
  FaBars,
  FaCaretDown,
  FaCaretRight,
  FaSearch,
  FaTimes
} from "react-icons/fa";
import { AirflowOperator, IAirflowOperator } from ".";
import { SidebarTitle, BaseSidebar, Theme } from "../Theme";

const RefreshSplit = styled.div`
  min-width: 300px;
`;

const FloatLeftText = styled.div`
  float: left;
`;

const FloatRightButton = styled.div`
  color: ${Theme.colors.brand};
  border-radius: 15px;
  padding: 0px 5px;
  float: right;
  transition: 0.3s ease all;
  cursor: pointer;
  &:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  &:active {
    background: ${Theme.colors.lightAccent2};
  }
`;

const DropdownTitle = styled.div`
  padding: 10px 10px;
  transition: 0.3s ease all;
  cursor: pointer;
  border: 1px solid ${Theme.colors.lightAccent};
  &:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  &:active {
    background: ${Theme.colors.lightAccent};
  }
`;

const SearchDiv = styled.div`
  border: 1px solid ${Theme.colors.lightAccent};
  display: flex;
  flex-direction: row;
`;

const SearchBar = styled.input`
  margin: 10px 20px 10px 10px;
  width: 100%;
  padding: 7px;
  border: 1px solid ${Theme.colors.brand};
  border-radius: 3px;
  &:hover {
    background: ${Theme.colors.light};
  }
`;

const SearchIcon = styled.div`
  color: ${Theme.colors.brand};
  margin: 20px 20px 20px 0px;
`;

const ModuleDiv = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const distinct = (value, index, self) => {
  return self.indexOf(value) === index;
};

const prettyName = (name: string) => {
  return name
    .split(".")
    .pop()
    .split("_")
    .map((val: string) =>
      "".concat(val.slice(0, 1).toUpperCase(), val.slice(1))
    )
    .join(" ");
};

const cleanModuleName = (str: string) => {
  str = str.replace(" ", "");
  str = str.replace("_", "");
  return str;
};

const filterModules = (operator: IAirflowOperator, searchTerm: string) => {
  // Returns true if an operator should be displayed for a given search term

  searchTerm = cleanModuleName(searchTerm);
  return (
    cleanModuleName(operator.properties.module)
      .toLowerCase()
      .indexOf(searchTerm.toLowerCase()) >= 0 ||
    cleanModuleName(operator.type)
      .toLowerCase()
      .indexOf(searchTerm.toLowerCase()) >= 0
  );
};

class AirflowModule extends React.Component<{
  moduleName: string;
  isModuleOpen: Function;
  setModule: Function;
}> {
  public constructor(props) {
    super(props);

    this.handleDropDown = this.handleDropDown.bind(this);
    this.handleFoldUp = this.handleFoldUp.bind(this);
  }

  public get isOpen(): boolean {
    return this.props.isModuleOpen(this);
  }

  handleDropDown() {
    this.props.setModule(this);
  }

  handleFoldUp() {
    this.props.setModule(null);
  }

  public render() {
    return React.Children.toArray(this.props.children).length >= 1 ? (
      // return true ? (
      this.isOpen ? (
        <div>
          <DropdownTitle onClick={this.handleFoldUp}>
            <FaCaretDown />
            {this.props.moduleName}
          </DropdownTitle>
          {this.props.children}
        </div>
      ) : (
        <div>
          <DropdownTitle onClick={this.handleDropDown}>
            <FaCaretRight />
            {this.props.moduleName}
          </DropdownTitle>
        </div>
      )
    ) : (
      <div />
    );
  }
}

export class OperatorSidebar extends React.Component<
  {
    operators: IAirflowOperator[];
    refreshOperators: Function;
  },
  {
    openComponent: AirflowModule;
    searchValue: string;
    isOpen: boolean;
  }
> {
  public constructor(props) {
    super(props);

    this.handleSearch = this.handleSearch.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.isModuleOpen = this.isModuleOpen.bind(this);
    this.setOpenModule = this.setOpenModule.bind(this);
  }

  state = {
    openComponent: null,
    searchValue: "",
    isOpen: true
  };

  public handleRefresh() {
    this.props.refreshOperators();
  }

  public handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const val = event.target.value;
    this.setState(prevState => ({
      ...prevState,
      searchValue: val
    }));
  }

  public toggleSidebar = () => {
    const open = !this.state.isOpen;
    this.setState({
      isOpen: open
    });
  };

  public isModuleOpen(moduleComponent: AirflowModule) {
    return this.state.searchValue.length > 0
      ? true
      : moduleComponent === this.state.openComponent;
  }

  public setOpenModule(moduleComponent: AirflowModule) {
    this.setState({
      openComponent: moduleComponent
    });
  }

  public getModules() {
    return this.props.operators
      .map((operator: IAirflowOperator) => operator.properties.module)
      .filter(distinct)
      .map(prettyName);
  }

  public renderContent() {
    return (
      <BaseSidebar>
        <SidebarTitle>
          <RefreshSplit>
            <FloatLeftText>Operator Library</FloatLeftText>
            <FloatRightButton onClick={this.toggleSidebar}>
              <FaTimes />
            </FloatRightButton>
            <FloatRightButton onClick={this.handleRefresh}>
              <FaSync />
            </FloatRightButton>
          </RefreshSplit>
        </SidebarTitle>
        <SearchDiv>
          <SearchBar
            placeholder={"Search operators"}
            onChange={this.handleSearch}
          />
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
        </SearchDiv>
        <ModuleDiv>
          {this.props.operators ? (
            [].concat(
              ...this.getModules()
                .sort()
                .map((mod: string, mod_ind: number) => (
                  <AirflowModule
                    moduleName={mod}
                    isModuleOpen={this.isModuleOpen}
                    setModule={this.setOpenModule}
                    key={`${mod}-${mod_ind}`}
                  >
                    {[].concat(
                      ...this.props.operators
                        .filter(
                          //Operators are grouped by module name
                          (operator: IAirflowOperator) =>
                            prettyName(operator.properties.module) == mod
                        )
                        .filter(
                          //Only return results expected by search value
                          (operator: IAirflowOperator) =>
                            filterModules(operator, this.state.searchValue)
                        )
                        .sort((a: IAirflowOperator, b: IAirflowOperator) =>
                          a.type < b.type ? -1 : a.type > b.type ? 1 : 0
                        )
                        .map((operator: IAirflowOperator, i: Number) => (
                          <AirflowOperator
                            {...operator}
                            key={`${operator.type}-${i}`}
                          />
                        ))
                    )}
                  </AirflowModule>
                ))
            )
          ) : (
            <p>Loading operators...</p>
          )}
        </ModuleDiv>
      </BaseSidebar>
    );
  }

  public render() {
    return this.state.isOpen ? (
      this.renderContent()
    ) : (
      <FloatRightButton
        onClick={() => this.toggleSidebar()}
        style={{ padding: `7.5px 10px` }}
      >
        <FaBars />
      </FloatRightButton>
    );
  }
}
