import * as React from "react";
import styled from "styled-components";

const NavbarDropdownContent = styled.div`
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0, 2);
  padding: 12px 16px;
  z-index: 1;
`;

const NavbarDropdown = styled.div`
  position: relative;
  display: inline-block;
  &:hover ${NavbarDropdownContent} {
    display: block;
  }
`;

export const Toolbar: React.FC = () => {
  return (
    <NavbarDropdown>
      <span>Menu</span>
      <NavbarDropdownContent>
        Furnish Later
      </NavbarDropdownContent>
    </NavbarDropdown>
  );
};
