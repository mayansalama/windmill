import React, { Component } from "react";
import styled from "styled-components";

export function Footer() {
  return (
    <FooterContainer>
      <ConsoleText>
        console ><ConsoleTextBlink> _ </ConsoleTextBlink>
      </ConsoleText>
    </FooterContainer>
  );
}

const FooterContainer = styled.div`
  height: 10rem;
  background: black;
  position: fixed;
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
