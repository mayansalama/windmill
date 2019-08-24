import * as React from "react";
import styled from "styled-components";
import { INode, REACT_FLOW_CHART } from "@mrblenny/react-flow-chart";
import { Theme } from "../Theme";

const Outer = styled.div`
  padding: 20px 30px;
  font-size: ${Theme.fonts.normalSize};
  background: white;
  cursor: move;
  &:hover {
    box-shadow: 2px 5px 10px rgba(0, 0, 0, 0.1) inset;
  }
`;

const DefaultPorts = {
  port1: {
    id: "port1",
    type: "top",
    properties: {
      custom: "property"
    }
  },
  port2: {
    id: "port1",
    type: "bottom",
    properties: {
      custom: "property"
    }
  }
};

export interface IAirflowOperatorParameter {
  id: string;
  type: "str" | "bool" | "dict" | "list";
  value?: string;
  default?: string;
  tooltip?: string;
}

export interface IAirflowOperatorProperties {
  name?: string;
  parameters?: Array<IAirflowOperatorParameter>;
  description?: string;
}

export interface IAirflowOperator {
  type: string;
  properties: IAirflowOperatorProperties;
  ports?: INode["ports"];
}

export const AirflowOperator = ({
  type,
  ports,
  properties
}: IAirflowOperator) => {
  if (!ports) {
    ports = DefaultPorts;
  }
  return (
    <Outer
      draggable={true}
      onDragStart={event => {
        event.dataTransfer.setData(
          REACT_FLOW_CHART,
          JSON.stringify({ type, ports, properties })
        );
      }}
    >
      {type}
    </Outer>
  );
};
