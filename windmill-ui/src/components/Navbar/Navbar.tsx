import * as React from "react";
import styled from "styled-components";
import {Theme} from "../Theme"

export const DropdownNavbar = (props: {
  icon: JSX.Element;
  brand: { name: string; to: string };
  links: Array<{ name: string; to: string }>;
}) => {
  const { icon, brand, links } = props;
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
  /* overflow: scroll; */
  /* overflow-x: hidden; */
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
  -webkit-box-align: center;
  -webkit-box-pack: center;
  -webkit-tap-highlight-color: transparent;
  align-items: center;
  color: #999;
  display: flex;
  font-size: 14px;
  height: 20px;
  justify-content: center;
  line-height: 16px;
  margin: 0 1.125rem;
  text-decoration: none;
  white-space: nowrap;
`;
