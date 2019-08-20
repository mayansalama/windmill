import * as React from "react";
import { cloneDeep } from "lodash";
import styled, { css } from "styled-components";
import { INodeInnerDefaultProps, INode } from "@mrblenny/react-flow-chart";
import { Theme } from "../Theme";
import { IAirflowOperatorParameter, IAirflowOperatorProperties } from ".";

const Outer = styled.div`
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

const SectionTitle = styled.div`
  padding: 8px 4px;
  font-size: ${Theme.fonts.subHeadingSize};
  color: ${Theme.colors.darkAccent};
`;

const OperatorNameStyle = css`
  font-size: ${Theme.fonts.subHeadingSize};
  border-radius: 3px;
`;

const OperatorName = styled.div`
  ${OperatorNameStyle}
  padding: 3px;
`;

const OperatorInput = styled.input`
  padding: 7px;
  border: 1px solid ${Theme.colors.brand};
  &:hover {
    background: ${Theme.colors.light};
  }
  ${OperatorNameStyle}
`;

const OperatorType = styled.div`
  float: right;
  font-size: ${Theme.fonts.normalSize};
  font-style: italic;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid ${Theme.colors.brand};
  width: 100%;
`;

export class RenderedAirflowParameterAsForm extends React.Component<{
  params: IAirflowOperatorParameter;
  index: number;
  updateFunc: Function;
}> {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newParams = cloneDeep(this.params);
    newParams["value"] = event.target.value;
    this.props.updateFunc(newParams, this.props.index);
  }

  get params(): IAirflowOperatorParameter {
    return this.props.params;
  }

  public render() {
    switch (this.params.type) {
      case "str": {
        return (
          <tr>
            <td>
              <Tooltip>{this.params.id}</Tooltip>
            </td>
            <td>
              <Input
                placeholder="Input field value..."
                type={"text"}
                value={this.params.value || ""}
                onChange={this.handleChange}
              />
            </td>
          </tr>
        );
      }
      case "bool": {
        return (
          <tr>
            <td>
              <Tooltip>{this.params.id}</Tooltip>
            </td>
            <td>
              <Input
                type={"checkbox"}
                checked={this.params.default === "true" || false}
                onClick={e => e.stopPropagation()}
                onMouseUp={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
              />
            </td>
          </tr>
        );
      }
      case "dict": {
        return <p>Dict Not Implemented Yet</p>;
      }
    }
  }
}

export class RenderedAirflowOperatorAsForm extends React.Component<{
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
            <OperatorType>{this.props.type}</OperatorType>
          </div>
          <OperatorInput
            placeholder="Input operator name..."
            type={"text"}
            value={this.props.operatorProps.name || ""}
            onChange={this.handleNameChange}
          />
        </Outer>
        <Outer>
          <SectionTitle>Parameters</SectionTitle>
          <table>
            <tbody>
              {[].concat(
                ...this.props.operatorProps.parameters.map((p, i) => {
                  return [
                    <RenderedAirflowParameterAsForm
                      params={p}
                      key={`${p.id}-i`}
                      updateFunc={this.handleChange}
                      index={i}
                    />
                  ];
                })
              )}
            </tbody>
          </table>
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
      <OperatorName>{node.properties.name || "Unnamed"}</OperatorName>
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
        <RenderedAirflowOperatorAsForm
          operatorProps={this.props.node.properties}
          updateParams={this.handleParameterUpdate}
          type={this.props.node.type}
        />
      </div>
    );
  }
}
