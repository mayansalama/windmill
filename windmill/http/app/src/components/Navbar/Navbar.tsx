import * as React from "react";
import ReactTooltip from "react-tooltip";
import styled from "styled-components";
import { Theme } from "../Theme";
import { StyledSpinner } from "../../misc/icon";

export interface IDropdownNavbarProps {
  icon: JSX.Element;
  brand: { name: string; to: any };
  buttons: Array<{ tooltip: string; icon: JSX.Element; callback: Function }>;
  dropdownHandlers: Array<{ name: string; callback: Function }>;
  renameHandler: Function;
  filename?: string;
}

export const DropdownNavbar = (props: IDropdownNavbarProps) => {
  const {
    filename,
    icon,
    brand,
    buttons,
    dropdownHandlers,
    renameHandler,
  } = props;
  const DropdownButtons: any = () =>
    dropdownHandlers.map((link) => link.callback());
  return (
    <Navbar>
      <Brand href={brand.to}>{icon}</Brand>
      <WindmillTitle>
        <h1>Windmill</h1>
      </WindmillTitle>
      {/* <DropDownSplit> */}
      <Debug>
        <DropdownButtons />
      </Debug>
      <FilenameContainer>
        {filename === "Untitled" ? (
          <Filename data-tip="Rename" onClick={() => renameHandler()}>
            {filename}
          </Filename>
        ) : (
          <Filename onClick={() => renameHandler()}>{filename}</Filename>
        )}
      </FilenameContainer>
      <MenuContainer>
        {[].concat(
          ...buttons.map((b, i) => {
            return (
              <div
                data-tip={b.tooltip}
                // data-place="bottom"
                key={`navbar-button-${i}`}
                onClick={() => b.callback()}
              >
                {b.icon}
              </div>
            );
          })
        )}
      </MenuContainer>
      {/* </DropDownSplit> */}
    </Navbar>
  );
};

const Navbar = styled.nav`
  display: grid;
  grid-template-columns: 35px 120px 0.5fr 2fr 220px;
  color: white;
  padding: 1rem;
  font-family: ${Theme.fonts.heading};
  align-items: baseline;
  // color: ${Theme.colors.light};
  // display: flex;
  // flex: 1;
  // align-items: center;
  // a {
  //   color: ${Theme.colors.light};
  //   text-decoration: none;
  // }
`;

const Brand = styled.a`
  width: 25px;
  height: 25px;
  // font-weight: bold;
  // font-style: italic;
  // margin: 0.2rem 0.5rem 0.2rem 0.5rem;
`;

const WindmillTitle = styled.div`
  grid-column: 2 / span 1;
  h1 {
    font-size: 1.5rem;
    font-weight: 900;
  }
`;

const DropDownSplit = styled.div`
  // display: flex;
  // flex-direction: column;
  // flex: 1;
  // grid-column-start: 1;
  // grid-column-end: 3;
  // margin-top: 1rem;
`;

const FilenameContainer = styled.div`
  // margin: 0px 0px;
  // display: flex;
  // flex-wrap: nowrap;
  // -webkit-overflow-scrolling: touch;
  grid-column: 4 / span 1;
  text-align: center;
`;

const Filename = styled.span`
  // padding: 3px 12px;
  // color: white;
  // text-align: left;
  // font-size: ${Theme.fonts.headingSize};
  // transition: 0.3s ease all;
  // border-radius: 3px;
  // cursor: pointer;
  // &:hover {
  //   background: ${Theme.colors.darkAccent};
  // }

  padding: 3px 12px;
  &:hover {
    box-shadow: 30px 30px 30px rgba(0.5, 0.5, 0.5, 0.5) inset;
    -webkit-border-radius: 71px;
  }
  cursor: pointer;

  data-tip {
    font-size: 5rem;
  }
`;

const Debug = styled.div``;

const MenuContainer = styled.div`
  display: flex;
  // align-items: stretch;
  justify-content: space-around;
  // width: 100%;
  // background: #cacaca;
  // margin: 0;
  // padding: 0;
`;
