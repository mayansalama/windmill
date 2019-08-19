import * as React from "react";
import styled from "styled-components";
import { INodeInnerDefaultProps, INode } from "@mrblenny/react-flow-chart";
import { Theme } from "../Theme";
import { IAirflowOperatorParameter, IAirflowOperatorProperties } from ".";

const Inner = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;

const Outer = styled.div`
  padding: 15px;
  /* border: 1px solid ${Theme.colors.darkAccent}; */
`;

const TypeText = styled.div`
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
          <Inner>
            <p>{this.props.id}</p>
            <Input
              placeholder="Input field value..."
              type={"text"}
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

export class RenderedAirflowOperatorAsForm extends React.Component<
  IAirflowOperatorProperties
> {
  public render() {
    return (
      <Outer>
        <p>{this.props.name}</p>
        {[].concat(
          ...this.props.parameters.map((p, i) => {
            return [
              <RenderedAirflowParameterAsForm
                id={p.id}
                type={p.type}
                default={p.default}
                key={`${p.id}-i`}
              />,
              <br key={`${p.id}-br-i`} />
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
  return (
    <Outer>
      <TypeText>{node.type}</TypeText>
      <OperatorName
        placeholder="Enter name..."
        type={"text"}
        onClick={e => e.stopPropagation()}
        onMouseUp={e => e.stopPropagation()}
        onMouseDown={e => e.stopPropagation()}
      />
    </Outer>
  );
};

export const AirflowNodeForm = ({ node }: IAirflowNodeDefaultProps) => {
  return (
    <div>
      <AirflowNode node={node} />
      <RenderedAirflowOperatorAsForm
        name={node.properties.name}
        parameters={node.properties.parameters}
      />
    </div>
  );
};
