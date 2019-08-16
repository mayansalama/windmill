import styled from "styled-components"

export const Theme = {
  colors: {
    light: `#F5F7F9`,
    lightAccent: `#dcdee0`,
    dark: `#45689D`,
    darkAccent: `#809BC6`,
    brand: "cornflowerBlue",
    red: `#ff5851`
  },
  fonts: {
    body: `IBM Plex Sans, sans-serif`,
    heading: `IBM Plex Sans, sans-serif`
  }
};

export const SidebarTitle = styled.div`
  font-size: 1.3em;
  margin: 10px;
  padding: 15px;
`;

export const BaseSidebar = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  overflow: hidden;
`;