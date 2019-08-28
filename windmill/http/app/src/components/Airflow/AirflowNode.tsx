import * as React from "react";
import { cloneDeep } from "lodash";
import styled, { css } from "styled-components";
import Textarea from "react-textarea-autosize";
import { INodeInnerDefaultProps, INode } from "@mrblenny/react-flow-chart";
import { Theme } from "../Theme";
import { IAirflowOperatorParameter, IAirflowOperatorProperties } from ".";

export const Outer = styled.div`
  border: 1px solid ${Theme.colors.lightAccent};
  padding: 15px;
  display: flex;
  flex: 0 1 auto;
  flex-direction: column;
`;

const Tooltip = styled.div`
  float: left;
  padding: 4px;
  font-size: ${Theme.fonts.normalSize};
  color: ${Theme.colors.darkAccent};
`;

export const SectionTitle = styled.div`
  padding: 8px 4px;
  font-size: ${Theme.fonts.subHeadingSize};
  color: ${Theme.colors.darkAccent};
`;

const OperatorNameStyle = css`
  font-size: ${Theme.fonts.subHeadingSize};
  border-radius: 3px;
`;

const Name = styled.div`
  ${OperatorNameStyle}
  padding: 3px;
`;

const NameInput = styled.input`
  padding: 7px;
  border: 1px solid ${Theme.colors.brand};
  &:hover {
    background: ${Theme.colors.light};
  }
  ${OperatorNameStyle}
`;

export const Type = styled.div`
  float: right;
  font-size: ${Theme.fonts.normalSize};
  font-style: italic;
`;

const SmartTextAreaBase = css`
  border-radius: 5px;
  height: 100%;
  width: 100%;
  font-family: ${Theme.fonts.body};
  background: white;
`;

const SmartTextAreaInput = css`
  border: none;
  padding: 10px;

  &:hover {
    background: ${Theme.colors.light};
    outline: none;
  }
  &:focus {
    background: ${Theme.colors.light};
    outline: none;
  }
`;

const SmartTextAreaDiv = styled.div`
  ${SmartTextAreaBase};
  padding: 1px;
  border: 1px solid ${Theme.colors.brand};
`;

const StyledSelect = styled.select`
  ${SmartTextAreaBase};
  ${SmartTextAreaInput};
`;

const StyledOption = styled.option`
  ${SmartTextAreaBase};
`;

const StyledTextarea = styled(Textarea)`
  ${SmartTextAreaBase};
  ${SmartTextAreaInput};
  resize: none;
  overflow: hidden;
`;

const StyledLabel = styled.div`
  ${SmartTextAreaBase};
  font-size: ${Theme.fonts.normalSize};
  padding: 4px 10px 0px 6px;
  color: ${Theme.colors.darkAccent};
`;

interface ISmartTextAreaProps {
  onChange: Function;
  type: "text" | "bool" | "number";
  value: string;
  id: string;
  placeholder?: string;
}

class SmartTextarea extends React.Component<ISmartTextAreaProps> {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    return this.props.onChange(event);
  }

  public get isValid(): boolean {
    // if (this.props.validate) {
    //   return this.props.validate(this.props.value);
    // }
    return true;
  }

  public renderText() {
    const { id, value, placeholder } = this.props;

    return (
      <SmartTextAreaDiv>
        <StyledLabel>{id}</StyledLabel>
        <StyledTextarea
          id={id}
          value={value}
          onChange={event => this.onChange(event.target.value)}
          placeholder={placeholder || "Input string..."}
        />
      </SmartTextAreaDiv>
    );
  }

  public renderInt() {
    const { id, value, placeholder } = this.props;

    return (
      <SmartTextAreaDiv>
        <StyledLabel>{id}</StyledLabel>
        <StyledTextarea
          id={id}
          value={value}
          onChange={event => this.onChange(event.target.value)}
          placeholder={placeholder || "Input number..."}
        />
      </SmartTextAreaDiv>
    );
  }

  public renderBool() {
    const { id, value } = this.props;

    return (
      <SmartTextAreaDiv>
        <StyledLabel>{id}</StyledLabel>
        <StyledSelect
          onChange={event => this.onChange(event.target.value)}
          value={value}
        >
          <StyledOption>True</StyledOption>
          <StyledOption>False</StyledOption>
        </StyledSelect>
      </SmartTextAreaDiv>
    );
  }

  public render() {
    switch (this.props.type) {
      case "number":
        return this.renderInt();
      case "text":
        return this.renderText();
      case "bool":
        return this.renderBool();
    }
  }
}

export class RenderedAirflowParameter extends React.Component<{
  params: IAirflowOperatorParameter;
  index: number;
  updateFunc: Function;
}> {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value: any) {
    const newParams = cloneDeep(this.params);
    newParams["value"] = value;
    this.props.updateFunc(newParams, this.props.index);
  }

  get params(): IAirflowOperatorParameter {
    return this.props.params;
  }

  public render() {
    switch (this.params.type) {
      case "str": {
        return (
          <SmartTextarea
            type="text"
            id={this.params.id}
            value={this.params.value || ""}
            onChange={this.handleChange}
          />
        );
      }
      case "bool": {
        return (
          <SmartTextarea
            type="bool"
            id={this.params.id}
            value={this.params.value || ""}
            onChange={this.handleChange}
          />
        );
      }
      case "float":
      case "int": {
        return (
          <SmartTextarea
            type="number"
            id={this.params.id}
            value={this.params.value || ""}
            onChange={this.handleChange}
          />
        );
      }
      case "datetime.datetime": {
        return (
          <SmartTextarea
            type="text"
            id={this.params.id}
            value={this.params.value || ""}
            onChange={this.handleChange}
            placeholder="Enter datetime in form 'YYYY-MM-DD HH:mm:ss'"
          />
        );
      }
      case "datetime.timedelta": {
        return (
          <SmartTextarea
            type="text"
            id={this.params.id}
            value={this.params.value || ""}
            onChange={this.handleChange}
            placeholder="Enter timedelta in form 'XX units'"
          />
        );
      }
      case "list": {
        return (
          <SmartTextarea
            type="text"
            id={this.params.id}
            value={this.params.value || ""}
            onChange={this.handleChange}
            placeholder="Enter comma seperated list"
          />
        );
      }
      case "mapping":
      case "dict": {
        return (
          <SmartTextarea
            type="text"
            id={this.params.id}
            value={this.params.value || ""}
            onChange={this.handleChange}
            placeholder="Enter JSON dict"
          />
        );
      }
      default:
        return <p>{this.params.type} is not Implemented Yet</p>;
    }
  }
}

export class RenderedAirflowParametersAsForm extends React.Component<{
  operatorProps: IAirflowOperatorProperties;
  type: string;
  updateParams: Function;
}> {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleChange(params: IAirflowOperatorParameter, index: number) {
    const newProps = cloneDeep(this.props.operatorProps);
    newProps["parameters"][index] = params;
    this.props.updateParams(newProps);
  }

  handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newProps = cloneDeep(this.props.operatorProps);
    newProps["name"] = event.target.value;
    this.props.updateParams(newProps);
  }

  public render() {
    return (
      <div>
        <Outer>
          <div>
            <Tooltip>Name</Tooltip>
            <Type>{this.props.type}</Type>
          </div>
          <NameInput
            placeholder="Input name.."
            type={"text"}
            value={this.props.operatorProps.name || ""}
            onChange={this.handleNameChange}
          />
        </Outer>
        <Outer>
          <SectionTitle>Parameters</SectionTitle>
          {[].concat(
            ...this.props.operatorProps.parameters.map((p, i) => {
              return [
                <div>
                  <RenderedAirflowParameter
                    params={p}
                    key={`${p.id}-${i}`}
                    updateFunc={this.handleChange}
                    index={i}
                  />
                  <br key={`${p.id}-${i}-br`} />
                </div>
              ];
            })
          )}
        </Outer>
      </div>
    );
  }
}

export interface IAirflowNode extends INode {
  properties?: IAirflowOperatorProperties;
}

interface IAirflowNodeDefaultProps extends INodeInnerDefaultProps {
  node: IAirflowNode;
}

export const AirflowNode = ({ node }: IAirflowNodeDefaultProps) => {
  return (
    <Outer>
      <Tooltip>{node.type}</Tooltip>
      <Name>{node.properties.name || "Unnamed"}</Name>
    </Outer>
  );
};

export class AirflowNodeForm extends React.Component<{
  node: IAirflowNode;
  updateNodeProps: Function;
}> {
  constructor(props) {
    super(props);
    this.handleParameterUpdate = this.handleParameterUpdate.bind(this);
  }

  handleParameterUpdate(newProps: IAirflowOperatorProperties) {
    this.props.updateNodeProps(this.props.node.id, newProps);
  }

  public render() {
    return (
      <div>
        <RenderedAirflowParametersAsForm
          operatorProps={this.props.node.properties}
          updateParams={this.handleParameterUpdate}
          type={this.props.node.type}
        />
      </div>
    );
  }
}
