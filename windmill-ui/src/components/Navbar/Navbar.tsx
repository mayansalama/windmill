import * as React from "react";
import styled from "styled-components";
import { Theme } from "../Theme";

export interface IDropdownNavbarProps {
  icon: JSX.Element;
  brand: { name: string; to: any };
  dropdownHandlers: Array<{ name: string; callback: Function }>;
}

export const DropdownNavbar = (props: IDropdownNavbarProps) => {
  const { icon, brand, dropdownHandlers } = props;
  const DropdownButtons: any = () =>
    dropdownHandlers.map(link => link.callback());
  return (
    <Navbar>
      <Icon>{icon}</Icon>
      <Brand href={brand.to}>{brand.name}</Brand>
      <Ul>
        <DropdownButtons />
      </Ul>
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

const Icon = styled.div`
  font-weight: bold;
  font-style: italic;
  font-size: 1.4em;
  margin-left: 1rem;
  padding-right: 1rem;
`;

const Brand = styled.a`
  font-weight: bold;
  font-style: italic;
  margin-left: 1rem;
  padding-right: 1rem;
`;

const Ul = styled.ul`
  display: flex;
  flex-wrap: nowrap;
  -webkit-overflow-scrolling: touch;
`;
