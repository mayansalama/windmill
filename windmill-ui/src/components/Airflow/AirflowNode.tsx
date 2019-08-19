import * as React from "react";
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

export class RenderedAirflowParameterAsForm extends React.Component<
  IAirflowOperatorParameter
> {
  public render() {
    switch (this.props.type) {
      case "str": {
        return (
          <tr>
            <td>
              <Tooltip>{this.props.id}</Tooltip>
            </td>
            <td>
              <Input
                placeholder="Input field value..."
                type={"text"}
                onClick={e => e.stopPropagation()}
                onMouseUp={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
              />
            </td>
          </tr>
        );
      }
      case "bool": {
        return (
          <tr>
            <td>
              <Tooltip>{this.props.id}</Tooltip>
            </td>
            <td>
              <Input
                type={"checkbox"}
                checked={this.props.default === "true" || false}
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

export class RenderedAirflowOperatorAsForm extends React.Component<
  IAirflowOperatorProperties
> {
  public render() {
    return (
      <div>
        <br />
        <Tooltip>Required Parameters</Tooltip>
        <table>
          <tbody>
            {[].concat(
              ...this.props.parameters.map((p, i) => {
                return [
                  <RenderedAirflowParameterAsForm
                    id={p.id}
                    type={p.type}
                    default={p.default}
                    key={`${p.id}-i`}
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

export const AirflowNodeForm = ({ node }: IAirflowNodeDefaultProps) => {
  return (
    <div>
      <AirflowNodeInterior node={node} />
      <RenderedAirflowOperatorAsForm
        name={node.properties.name}
        parameters={node.properties.parameters}
      />
    </div>
  );
};
