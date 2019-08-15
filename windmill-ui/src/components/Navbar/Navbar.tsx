import * as React from "react";
import styled from "styled-components";
import { ActionItem, DropDownItemBase } from "react-dropdown-advanced";
import { Theme } from "../Theme";

export interface IDropdownNavbarProps {
  icon: JSX.Element;
  brand: { name: string; to: any };
  links: Array<{ name: string; to: string }>;
  dropdownHandlers: Array<{ name: string; callback: Function }>;
}

export const DropdownNavbar = (props: IDropdownNavbarProps) => {
  const { icon, brand, links, dropdownHandlers } = props;
  const NavLinks: any = () =>
    links.map((link: { name: string; to: string }) => (
      <Li key={link.name}>
        <a href={link.to}>{link.name}</a>
      </Li>
    ));
  return (
    <Navbar>
      <Brand href={brand.to}>{brand.name}</Brand>
      <Ul>
        <NavLinks />
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
  font-size: 1.5em;
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

const Li = styled.li`
  flex: 0 0 auto;
  -webkit-box-align: center;
  -webkit-box-pack: center;
  -webkit-tap-highlight-color: transparent;
  align-items: center;
  color: #999;
  height: 100%;
  justify-content: center;
  text-decoration: none;
  line-height: 16px;
  margin: 0 1.125rem;
  text-decoration: none;
  white-space: nowrap;
`;
