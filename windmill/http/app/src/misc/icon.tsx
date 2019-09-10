import * as React from "react";
import styled from "styled-components";
import { Theme } from "../components/Theme";

const Svg = styled.svg`
  position: absolute;
  padding: 7px 7px;
  flex: 0 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 5px;
`;

const Path = styled.path`
  fill: ${Theme.colors.brand};
`;

export const Icon = () => {
  return (
    <Svg viewBox="0, 0, 400, 400">
      <Path
        id="path0"
        d="M153.485 49.515 L 103.999 99.030 151.924 146.924 C 178.283 173.266,200.108 194.373,200.424 193.829 C 200.741 193.286,244.196 149.452,296.992 96.421 L 392.984 0.000 297.977 0.000 L 202.970 0.000 153.485 49.515 M-0.000 100.018 L -0.000 193.030 50.005 243.005 L 100.010 292.980 146.501 246.488 L 192.992 199.997 96.496 103.501 L 0.000 7.005 -0.000 100.018 M251.953 152.985 L 204.906 199.921 302.453 297.453 L 400.000 394.985 400.000 300.978 L 400.000 206.971 349.500 156.510 L 299.000 106.049 251.953 152.985 M101.043 303.307 L 5.086 400.000 99.058 400.000 L 193.030 400.000 242.940 350.060 L 292.851 300.120 247.925 254.560 C 202.307 208.297,199.771 205.848,198.000 206.337 C 197.450 206.489,153.819 250.126,101.043 303.307 "
        stroke="none"
        fill-rule="evenodd"
      />
    </Svg>
  );
};

export const StyledSpinner = styled.svg`
  animation: rotate 2s linear infinite;
  margin: -25px 0 0 -25px;

  & .path {
    stroke: #5652bf;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`;
