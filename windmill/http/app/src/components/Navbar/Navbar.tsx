import * as React from "react";
import styled from "styled-components";
import { Theme } from "../Theme";

export interface IDropdownNavbarProps {
  icon: JSX.Element;
  brand: { name: string; to: any };
  dropdownHandlers: Array<{ name: string; callback: Function }>;
  renameHandler: Function;
  filename?: string;
}

export const DropdownNavbar = (props: IDropdownNavbarProps) => {
  const { filename, icon, brand, dropdownHandlers, renameHandler } = props;
  const DropdownButtons: any = () =>
    dropdownHandlers.map(link => link.callback());
  return (
    <Navbar>
      <Brand href={brand.to}>{icon}</Brand>
      <DropDownSplit>
        <Ul>
          <Filename onClick={() => renameHandler()}>{filename}</Filename>
        </Ul>
        <Ul>
          <DropdownButtons />
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
  width: 7vh;
  height: 7vh;
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

const Ul = styled.div`
  margin: 0px 0px;
  display: flex;
  flex-wrap: nowrap;
  -webkit-overflow-scrolling: touch;
`;
