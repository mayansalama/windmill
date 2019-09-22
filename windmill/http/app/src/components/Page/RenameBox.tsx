import React from "react";
import onClickOutside from "react-onclickoutside";
import { OverlayBoxRootstyle } from ".";
import styled, { css } from "styled-components";
import { App } from "../..";
import { Theme } from "../Theme";

const OverlayBox = styled.div`
  ${OverlayBoxRootstyle}
  left: 9vh;
  top: 5%;
`;

const NameDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const Tooltip = styled.div`
  margin: 10px;
  font-size: ${Theme.fonts.normalSize};
  font-weight: bold;
`;

const NameInput = styled.input`
  margin: 0px 10px;
  padding: 7px;
  border: 1px solid ${Theme.colors.brand};
  outline: none;
  font-size: ${Theme.fonts.subHeadingSize};
  border-radius: 3px;
`;

const ButtonDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const ButtonRoot = css`
  margin: 20px;
  padding: 10px 15px;
  border-radius: 3px;
  text-align: center;
  transition: 0.3s ease all;
  cursor: pointer;
  &:hover {
    box-shadow: 0 10px 20px 20px rgba(0, 0, 0, 0.1) inset;
  }
  &:active {
    background: #5682d2;
  }
`;

const BrandButton = styled.div`
  ${ButtonRoot}
  color: white;
  background: ${Theme.colors.brand};
`;

const AccentButton = styled.div`
  ${ButtonRoot}
  background: ${Theme.colors.lightAccent};
`;

class _RenameBox extends React.Component<
  { getApp: Function },
  { filename: string }
> {
  inputRef: React.RefObject<HTMLInputElement>;

  constructor(props) {
    super(props);
    this.state = {
      filename: this.app.state.filename
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.inputRef = React.createRef<HTMLInputElement>();
  }

  public componentDidMount() {
    this.inputRef.current.focus();
  }

  public get app(): App {
    return this.props.getApp();
  }

  public handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const val = event.target.value;
    this.setState(prevState => ({
      ...prevState,
      filename: val
    }));
  }

  public handleClickOutside = () => {
    this.app.toggleRenameBox();
  };

  public handleSave = () => {
    if ((this.app.state.filename === this.state.filename) || (this.state.filename === ""))  {
      return this.handleClickOutside();
    }
    // TODO: Setup prompt if file already exists
    this.app.updateFilename(this.state.filename);
    return this.handleClickOutside();
  };

  public render() {
    return (
      <OverlayBox>
        <NameDiv>
          <Tooltip>Enter New Filename</Tooltip>
          <NameInput
            ref={this.inputRef}
            value={this.state.filename}
            onChange={this.handleChange}
            onKeyPress={event => {
              if (event.key === "Enter") {
                this.handleSave();
              }
            }}
          />
        </NameDiv>
        <ButtonDiv>
          <BrandButton onClick={this.handleSave}>Save</BrandButton>
          <AccentButton onClick={this.handleClickOutside}>Cancel</AccentButton>
        </ButtonDiv>
      </OverlayBox>
    );
  }
}

export const RenameBox = onClickOutside(_RenameBox);
