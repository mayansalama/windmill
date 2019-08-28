import * as React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Theme } from "../Theme";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0px;
    max-width: 100vw;
    max-height: 100vh;
    overflow: hidden;
    box-sizing: border-box;
    font-family: sans-serif;
  }

  *, :after, :before {
    box-sizing: inherit;
  }
`;

const NavBarContent = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  background: ${Theme.colors.light};
  max-width: 100vw;
  height: 10vh;
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  background: ${Theme.colors.light};
  max-width: 100vw;
  height: 90vh;
`;

export const Page = ({ children }: { children: any }) => (
  <PageContent>
    {children}
    <GlobalStyle />
  </PageContent>
);

export const NavbarPage = ({ children }: { children: any }) => (
  <NavBarContent>
    {children}
    <GlobalStyle />
  </NavBarContent>
);
