import * as React from "react";
import styled, { createGlobalStyle, css } from "styled-components";
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

export const OverlayBoxRootstyle = css`
  position: absolute;
  float: none;
  margin: 0 auto;
  z-index: 100;
  background: ${Theme.colors.light};
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid ${Theme.colors.lightAccent2};
  border-radius: 10px;
`;
