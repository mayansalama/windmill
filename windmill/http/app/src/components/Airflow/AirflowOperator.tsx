import * as React from "react";
import styled from "styled-components";
import { FaWindowMaximize } from "react-icons/fa";
import { INode, REACT_FLOW_CHART } from "@mrblenny/react-flow-chart";
import { Theme } from "../Theme";

const Outer = styled.div`
  padding: 10px 10px;
  font-size: ${Theme.fonts.normalSize};
  background: white;
  border: 1px solid ${Theme.colors.lightAccent};
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
  type:
    | "str"
    | "bool"
    | "dict"
    | "list"
    | "str"
    | "dict"
    | "list"
    | "mapping"
    | "bool"
    | "int"
    | "float"
    | "datetime.timedelta"
    | "datetime.datetime";
  value?: string;
  default?: string;
  description?: string;
}

export interface IAirflowOperatorProperties {
  name?: string;
  parameters?: Array<IAirflowOperatorParameter>;
  description?: string;
  module?: string;
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
      <FaWindowMaximize />
      {" "}
      {type}
    </Outer>
  );
};
