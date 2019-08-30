import React from "react";
import styled, { css } from "styled-components";
import onClickOutside from "react-onclickoutside";
import { App } from "../../App";
import { Theme } from "../Theme";
import { FaSearch } from "react-icons/fa";

const OverlayBox = styled.div`
  position: absolute;
  float: none;
  margin: 0 auto;
  left: 450px;
  top: 15%;
  width: 750px;
  height: 750px;
  z-index: 100;
  background: ${Theme.colors.light};
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid ${Theme.colors.lightAccent2};
  border-radius: 10px;
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

const Table = styled.table`
  margin: 0 auto;
  margin-top: 4px;
  width: 99%;
  border-collapse: collapse;
`;

const TdTh = css`
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
`;

const Td = styled.td`
  ${TdTh}
`;

const Th = styled.th`
  ${TdTh}
`;

const Tr = styled.tr`
  :nth-child(even) {
    background-color: ${Theme.colors.lightAccent};
  }
`;

class _FileBrowser extends React.Component<
  { getApp: Function },
  {
    fileList: string[];
  }
> {
  state = {
    loadingFileList: true,
    fileList: [],
    searchValue: ""
  };

  public constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
  }

  public get app(): App {
    return this.props.getApp();
  }

  public componentDidMount() {
    this.setState(prevState => ({
      ...prevState,
      loadingFileList: true
    }));

    this.app.apiClient
      .getWmlList()
      .then(data => {
        this.setState(prevState => ({
          ...prevState,
          fileList: data
        }));
      })
      .then(() =>
        this.setState(prevState => ({
          ...prevState,
          loadingFileList: false
        }))
      );
  }

  public handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const val = event.target.value;
    this.setState(prevState => ({
      ...prevState,
      searchValue: val
    }));
  }

  public handleClickOutside = () => {
    this.app.toggleFileBrowser();
  };

  public render() {
    return (
      <OverlayBox style={{ zIndex: this.state.loadingFileList ? -1 : 100 }}>
        <SearchDiv>
          <SearchBar placeholder={"Search WMLs"} onChange={this.handleSearch} />
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
        </SearchDiv>
        <Table>
          <tbody>
            <Tr>
              <Th>Name</Th>
              <Th>Last Modified</Th>
              <Th>Owner</Th>
            </Tr>
            {[].concat(
              ...this.state.fileList
                .filter(
                  (val: string) => val.indexOf(this.state.searchValue) >= 0
                )
                .map((val: string, index: number) => (
                  <Tr key={`Tr-{index}`}>
                    <Td key={`Td-name-{index}`}>{val}</Td>
                    <Td key={`Td-lm-{index}`}>TODO</Td>
                    <Td key={`Tr-owner-{index}`}>TODO</Td>
                  </Tr>
                ))
            )}
          </tbody>
        </Table>
      </OverlayBox>
    );
  }
}

export const FileBrowser = onClickOutside(_FileBrowser);
