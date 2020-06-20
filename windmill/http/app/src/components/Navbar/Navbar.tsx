import * as React from "react";
import styled from "styled-components";
import { Theme } from "../Theme";
import { Icon, StyledHomeSpinner } from "../../misc/icon";
import Logo from "../../../assets/tom_profile_round.png";

export interface IDropdownNavbarProps {
  icon: JSX.Element;
  brand: { name: string; to: any };
  buttons: Array<{ tooltip: string; icon: JSX.Element; callback: Function }>;
  dropdownHandlers: Array<{ name: string; callback: Function }>;
  renameHandler: Function;
  filename?: string;
}

export const DropdownNavbar = (props: IDropdownNavbarProps) => {
  const { filename, brand, buttons, dropdownHandlers, renameHandler } = props;
  const DropdownButtons: any = () =>
    dropdownHandlers.map((link) => link.callback());
  return (
    <Navbar>
      <Brand href={brand.to}>
        <div style={{ position: "relative" }}>
          <StyledHomeSpinner style={{ width: "30px", height: "30px" }}>
            <Icon />
          </StyledHomeSpinner>
        </div>
      </Brand>
      <WindmillTitle>
        <h1>Windmill</h1>
      </WindmillTitle>
      <MenuContainer>
        {[].concat(
          ...buttons.map((b, i) => {
            return (
              <div
                data-tip={b.tooltip}
                // data-place="bottom"
                key={`navbar-button-${i}`}
                onClick={() => b.callback()}
              >
                {b.icon}
              </div>
            );
          })
        )}
      </MenuContainer>
      <Debug>
        <DropdownButtons />
      </Debug>
      <FilenameContainer>
        {filename === "Untitled" ? (
          <Filename
            data-tip="Rename your workspace"
            onClick={() => renameHandler()}
          >
            {filename}
          </Filename>
        ) : (
          <Filename onClick={() => renameHandler()}>{filename}</Filename>
        )}
      </FilenameContainer>
      {/* placeholder for Github integration */}
      <Avatar>
        <img src={Logo} />
        <Username>Tom K.</Username>
      </Avatar>
    </Navbar>
  );
};

const Navbar = styled.nav`
  display: grid;
  grid-template-columns: 40px 120px 1fr 0.5fr 2fr 220px;
  color: ${Theme.colors.light};
  padding: 0.8rem;
  font-family: ${Theme.fonts.heading};
  -webkit-align-items: baseline;
`;

const Brand = styled.a``;

const WindmillTitle = styled.div`
  grid-column: 2 / span 1;
  h1 {
    font-size: 1.5rem;
    font-weight: 900;
  }
`;

const Avatar = styled.div`
  grid-column: 6 / span 1;
  justify-self: right;

  img {
    object-fit: cover;
    width: 1rem;
  }
`;

const Username = styled.span`
  font-size: 0.8rem;
  padding: 4px;
`;

const Debug = styled.div`
  grid-column: 4 / span 1;
`;

const FilenameContainer = styled.div`
  grid-column: 5 / span 1;
  justify-self: center;
`;

const Filename = styled.span`
  transition: 0.3s ease all;
  padding: 3px 12px;
  cursor: pointer;

  &:hover {
    box-shadow: 30px 30px 30px rgba(0.5, 0.5, 0.5, 0.5) inset;
    -webkit-border-radius: 71px;
  }

  data-tip {
    font-size: ${Theme.fonts.headingSize};
  }
`;

const MenuContainer = styled.div`
  rid-column: 3 / span 1;
  display: flex;
  justify-content: space-around;
  cursor: pointer;
`;
