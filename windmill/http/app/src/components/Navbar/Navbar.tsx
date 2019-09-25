import * as React from "react";
import ReactTooltip from "react-tooltip";
import styled from "styled-components";
import { Theme } from "../Theme";

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
    renameHandler
  } = props;
  const DropdownButtons: any = () =>
    dropdownHandlers.map(link => link.callback());
  return (
    <Navbar>
      <Brand href={brand.to}>{icon}</Brand>
      <DropDownSplit>
        <Ul>
          <Filename
            data-tip="Rename"
            onClick={() => renameHandler()}
          >
            {filename}
          </Filename>
        </Ul>
        <Ul>
          <DropdownButtons />
        </Ul>
        <Ul>
          {[].concat(
            ...buttons.map((b, i) => {
              return (
                <MenuItem
                  data-tip={b.tooltip}
                  data-place="bottom"
                  key={`navbar-button-${i}`}
                  onClick={() => b.callback()}
                >
                  {b.icon}
                </MenuItem>
              );
            })
          )}
        </Ul>
      </DropDownSplit>
    </Navbar>
  );
};

const Navbar = styled.nav`
  background: ${Theme.colors.dark};
  font-family: ${Theme.fonts.heading};
  color: ${Theme.colors.light};
  display: flex;
  flex: 1;
  align-items: center;
  a {
    color: ${Theme.colors.light};
    text-decoration: none;
  }
`;

const Brand = styled.a`
  width: 5.5vh;
  height: 5.5vh;
  position: relative;
  font-weight: bold;
  font-style: italic;
  margin: 0.2rem 0.5rem 0.2rem 0.5rem;
`;

const DropDownSplit = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Filename = styled.div`
  padding: 3px 12px;
  color: white;
  text-align: left;
  font-size: ${Theme.fonts.headingSize};
  transition: 0.3s ease all;
  border-radius: 3px;
  cursor: pointer;
  &:hover {
    background: ${Theme.colors.darkAccent};
  }
`;

const MenuItem = styled.div`
  font-size: ${Theme.fonts.subHeadingSize};
  padding: 3px 12px;
  &:hover {
    box-shadow: 30px 30px 30px rgba(0, 0, 0, 0.5) inset;
  }
  &:active {
    background: #5682d2;
  }
`;

const Ul = styled.div`
  margin: 0px 0px;
  display: flex;
  flex-wrap: nowrap;
  -webkit-overflow-scrolling: touch;
`;
