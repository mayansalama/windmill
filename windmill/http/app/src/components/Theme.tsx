import styled from "styled-components";
import { ICanvasOuterDefaultProps } from "@mrblenny/react-flow-chart";

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

export const LeftPanelDefaultWidth = 400;

export const CanvasStyle = styled.div<ICanvasOuterDefaultProps>`
  position: relative;
  background-size: 10px 10px;
  background-color: white;
  background-image: linear-gradient(
      90deg,
      hsla(0, 10%, 0%, 0.05) 1px,
      transparent 0
    ),
    linear-gradient(180deg, hsla(0, 10%, 0%, 0.05) 1px, transparent 0);
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: not-allowed;
` as any;
