import styled from "styled-components"

export const Theme = {
  colors: {
    light: `#F5F7F9`,
    lightAccent: `#dce2e8`,
    lightAccent2: `#c5ccd4`,
    dark: `#45689D`,
    darkAccent: `#809BC6`,
    brand: "cornflowerBlue",
    red: `#ff5851`
  },
  fonts: {
    body: `IBM Plex Sans, sans-serif`,
    heading: `IBM Plex Sans, sans-serif`,
    headingSize: `22px`,
    subHeadingSize: `16px`,
    normalSize: `14px`
  }
};

export const SidebarTitle = styled.div`
  font-size: ${Theme.fonts.subHeadingSize};
  font-weight: bolder;
  border: 1px solid ${Theme.colors.lightAccent};
  padding: 15px;
  display: flex;
  flex: 0 1 auto;
`;

export const BaseSidebar = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;