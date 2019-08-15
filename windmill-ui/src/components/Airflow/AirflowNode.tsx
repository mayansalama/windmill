import * as React from "react";
import styled from "styled-components";
import { INodeInnerDefaultProps, INode } from "@mrblenny/react-flow-chart";
import { Theme } from "../Theme";
import { IAirflowOperatorParameter, IAirflowOperatorProperties } from ".";

const Inner = styled.div`
  /* padding: 5px; */
  display: flex;
  flex-direction: row;
  flex: 1;
`;

const Outer = styled.div`
  padding: 30px;
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
          <Inner>
            <p>{this.props.id}</p>
            <Input
              placeholder="Input field value..."
              type={"text"}
              // onInput={e => alert("Oi")}
              onClick={e => e.stopPropagation()}
              onMouseUp={e => e.stopPropagation()}
              onMouseDown={e => e.stopPropagation()}
            />
          </Inner>
        );
      }
      case "bool": {
        return (
          <Inner>
            <p>{this.props.id}</p>
            <Input
              type={"checkbox"}
              checked={this.props.default === "true" || false}
              onClick={e => e.stopPropagation()}
              onMouseUp={e => e.stopPropagation()}
              onMouseDown={e => e.stopPropagation()}
            />
          </Inner>
        );
      }
      case "dict": {
        return <p>Dict Not Implemented Yet</p>;
      }
    }
  }
}

export class RenderedAirflowOperatorAsNode extends React.Component<
  IAirflowOperatorProperties
> {
  public render() {
    return (
      <Outer>
        <p>{this.props.name}</p>
        {[].concat(
          ...this.props.parameters.map(p => {
            return [
              <RenderedAirflowParameterAsForm
                id={p.id}
                type={p.type}
                default={p.default}
              />,
              <br />
            ];
          })
        )}
      </Outer>
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
  if (node.type === "output-only") {
    return (
      <Outer>
        <p>Use Node inner to customise the content of the node</p>
      </Outer>
    );
  } else if (node.properties || false) {
    return (
      <RenderedAirflowOperatorAsNode
        name={node.properties.name}
        parameters={node.properties.parameters}
      />
    );
  } else {
    return (
      <Outer>
        <p>RegularNode</p>
      </Outer>
    );
  }
};
