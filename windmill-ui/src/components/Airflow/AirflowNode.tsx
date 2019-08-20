import * as React from "react";
import { cloneDeep } from "lodash";
import styled from "styled-components";
import { INodeInnerDefaultProps, INode } from "@mrblenny/react-flow-chart";
import { Theme } from "../Theme";
import { IAirflowOperatorParameter, IAirflowOperatorProperties } from ".";

const Node = styled.div`
  border: 1px solid ${Theme.colors.darkAccent};
  padding: 15px;
`;

const Tooltip = styled.div`
  padding: 4px;
  font-size: ${Theme.fonts.normalSize};
  color: ${Theme.colors.darkAccent};
`;

const OperatorName = styled.input`
  padding: 7px;
  font-size: ${Theme.fonts.subHeadingSize};
  border: 2px solid ${Theme.colors.light};
  border-radius: 3px;
  &:hover {
    border: 2px solid ${Theme.colors.brand};
  }
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
  updateParams: Function;
}> {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(params: IAirflowOperatorParameter, index: number) {
    const newProps = cloneDeep(this.props.operatorProps);
    newProps["parameters"][index] = params;
    this.props.updateParams(newProps);
  }

  public render() {
    return (
      <div>
        <br />
        <Tooltip>Required Parameters</Tooltip>
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

export const AirflowNodeInterior = ({ node }: IAirflowNodeDefaultProps) => {
  return (
    <div>
      <Tooltip>{node.type}</Tooltip>
      <OperatorName
        placeholder="Operator name..."
        type={"text"}
        onClick={e => e.stopPropagation()}
        onMouseUp={e => e.stopPropagation()}
        onMouseDown={e => e.stopPropagation()}
      />
    </div>
  );
};

export const AirflowNode = ({ node }: IAirflowNodeDefaultProps) => {
  return (
    <Node>
      <AirflowNodeInterior node={node} />
    </Node>
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
        <AirflowNodeInterior node={this.props.node} />
        <RenderedAirflowOperatorAsForm
          operatorProps={this.props.node.properties}
          updateParams={this.handleParameterUpdate}
        />
      </div>
    );
  }
}
