import React, { Component } from "react";
import styled from "styled-components";
import { Lazylog } from "./Lazylog";

export function FooterConsole() {
  return (
    <FooterConsoleContainer>
      <ConsoleText>
        console logs ><ConsoleTextBlink> _ </ConsoleTextBlink>
      </ConsoleText>
      {/* <Lazylog /> */}
    </FooterConsoleContainer>
  );
}

const FooterConsoleContainer = styled.div`
  height: 30vh;
  width: auto;
  background: black;
  // position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
`;

const ConsoleText = styled.div`
  color: white;
  font-size: 10px;
`;

const ConsoleTextBlink = styled.span`
  animation: blinker 1s linear infinite;

  @keyframes blinker {
    35% {
      opacity: 0;
    }
  }
`;
