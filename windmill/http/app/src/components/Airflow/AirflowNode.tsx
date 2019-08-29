import * as React from "react";
import { cloneDeep } from "lodash";
import styled, { css } from "styled-components";
import ReactTooltip from "react-tooltip";
import Textarea from "react-textarea-autosize";
import { FaInfoCircle } from "react-icons/fa";
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
  outline: none;
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

const StyledLableDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const StyledLabel = styled.div`
  ${SmartTextAreaBase};
  font-size: ${Theme.fonts.normalSize};
  padding: 4px 10px 0px 6px;
  color: ${Theme.colors.darkAccent};
  float: left;
  width: auto;
`;

const StyledInfo = styled.div`
  ${SmartTextAreaBase};
  font-size: ${Theme.fonts.normalSize};
  padding: 3px;
  /* border-radius: 4px; */
  color: ${Theme.colors.darkAccent};
  float: right;
  text-align: right;
  width: 20px;
`;

const StyledErrorMessage = styled.div`
  ${SmartTextAreaBase};
  font-size: ${Theme.fonts.normalSize};
  font-style: italic;
  padding: 4px 10px 0px 6px;
  color: red;
  float: right;
  text-align: right;
`;

const StyledTooltip = styled(ReactTooltip)`
  max-width: 300px;
`;

const isValid = (params: IAirflowOperatorParameter): string => {
  const { value, required, type } = params;
  let err_msg = "";

  if (required && !value) {
    err_msg = "required field";
  } else if (value) {
    if (type === "int" || type === "float") {
      if (Number(value).toString() != value) {
        err_msg = "Invalid number";
      } else if (type === "int" && Number(value) % 1 != 0) {
        err_msg = "Invalid integer";
      }
    }
  }

  return err_msg;
};

interface ISmartTextAreaProps {
  onChange: Function;
  type: "text" | "bool" | "number";
  params: IAirflowOperatorParameter;
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

  get isValid(): string {
    return isValid(this.props.params);
  }

  public renderText() {
    const { params, placeholder } = this.props;
    const { id, value } = params;

    return (
      <StyledTextarea
        id={id}
        value={value}
        onChange={event => this.onChange(event.target.value)}
        placeholder={placeholder || "Input string..."}
      />
    );
  }

  public renderInt() {
    const { params, placeholder } = this.props;
    const { id, value } = params;

    return (
      <StyledTextarea
        id={id}
        value={value}
        onChange={event => this.onChange(event.target.value)}
        placeholder={placeholder || "Input number..."}
      />
    );
  }

  public renderBool() {
    return (
      <StyledSelect
        onChange={event => this.onChange(event.target.value)}
        value={this.props.params.value}
      >
        <StyledOption>True</StyledOption>
        <StyledOption>False</StyledOption>
      </StyledSelect>
    );
  }

  public renderForm() {
    switch (this.props.type) {
      case "number":
        return this.renderInt();
      case "text":
        return this.renderText();
      case "bool":
        return this.renderBool();
    }
  }

  public render() {
    const { description, id, required } = this.props.params;
    const errmsg = this.isValid;

    return (
      <SmartTextAreaDiv
        style={{
          borderColor: errmsg
            ? "red"
            : required
            ? Theme.colors.brand
            : Theme.colors.lightAccent2
        }}
      >
        <StyledLableDiv>
          <StyledLabel>{id}</StyledLabel>
          <StyledErrorMessage>{errmsg}</StyledErrorMessage>
          <StyledInfo data-tip={description}>
            <FaInfoCircle />
          </StyledInfo>
        </StyledLableDiv>
        {this.renderForm()}
        <StyledTooltip multiline={true} place="right" />
      </SmartTextAreaDiv>
    );
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
            params={this.params}
            type="text"
            onChange={this.handleChange}
          />
        );
      }
      case "bool": {
        return (
          <SmartTextarea
            params={this.params}
            type="bool"
            onChange={this.handleChange}
          />
        );
      }
      case "float": {
        return (
          <SmartTextarea
            params={this.params}
            type="number"
            onChange={this.handleChange}
          />
        );
      }
      case "int": {
        return (
          <SmartTextarea
            params={this.params}
            type="number"
            onChange={this.handleChange}
            placeholder="Enter integer..."
          />
        );
      }
      case "datetime.datetime": {
        return (
          <SmartTextarea
            params={this.params}
            type="text"
            onChange={this.handleChange}
            placeholder="Enter datetime in form 'YYYY-MM-DD HH:mm:ss'"
          />
        );
      }
      case "datetime.timedelta": {
        return (
          <SmartTextarea
            params={this.params}
            type="text"
            onChange={this.handleChange}
            placeholder="Enter timedelta in form HH:mm:ss. E.g. 0:05:00 for 5 minutes"
          />
        );
      }
      case "list": {
        return (
          <SmartTextarea
            params={this.params}
            type="text"
            onChange={this.handleChange}
            placeholder="Enter JSON list"
          />
        );
      }
      case "mapping":
      case "dict": {
        return (
          <SmartTextarea
            params={this.params}
            type="text"
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

export interface IRenderedAirflowParametersAsFormProps {
  properties: IAirflowOperatorProperties;
  updateFunc: Function;
  nameField: string;
  type?: string;
}

export class RenderedAirflowParametersAsForm extends React.Component<
  IRenderedAirflowParametersAsFormProps
> {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleChange(params: IAirflowOperatorParameter, index: number) {
    const newProps = cloneDeep(this.props.properties);
    newProps["parameters"][index] = params;
    this.props.updateFunc(newProps);
  }

  handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newProps = cloneDeep(this.props.properties);
    newProps.name = event.target.value;
    for (let i = 0; i < newProps.parameters.length; i++) {
      if (newProps.parameters[i].id === this.props.nameField) {
        newProps.parameters[i]["value"] = event.target.value;
      }
    }
    this.props.updateFunc(newProps);
  }

  public render() {
    return (
      <div>
        <Outer>
          <div>
            <Tooltip>{this.props.nameField}</Tooltip>
            <FaInfoCircle
              data-tip={this.props.properties.description}
              style={{ float: "right", marginLeft: "5px" }}
            />
            {this.props.type ? <Type>{this.props.type}</Type> : null}
            <StyledTooltip multiline={true} place="right" />
          </div>
          <NameInput
            placeholder="Input name.."
            type={"text"}
            value={this.props.properties.name || ""}
            onChange={this.handleNameChange}
            style={{
              borderColor:
                this.props.properties.name === "" || !this.props.properties.name
                  ? "red"
                  : Theme.colors.brand
            }}
          />
        </Outer>
        <Outer>
          <SectionTitle>Parameters</SectionTitle>
          {[].concat(
            ...this.props.properties.parameters.map((p, i) => {
              return [
                p.id != this.props.nameField ? (
                  <div key={`${p.id}-${i}-div`}>
                    <RenderedAirflowParameter
                      params={p}
                      key={`${p.id}-${i}`}
                      updateFunc={this.handleChange}
                      index={i}
                    />
                    <br key={`${p.id}-${i}-br`} />
                  </div>
                ) : (
                  <div key={`${p.id}-${i}-div-name-placeholder`} />
                )
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
  const valid = node.properties.parameters.every(op => isValid(op) === "");
  return (
    <Outer style={{ borderColor: valid ? Theme.colors.lightAccent : "red" }}>
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
          nameField="task_id"
          properties={this.props.node.properties}
          updateFunc={this.handleParameterUpdate}
          type={this.props.node.type}
        />
      </div>
    );
  }
}
