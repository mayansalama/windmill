import { INode, REACT_FLOW_CHART } from '@mrblenny/react-flow-chart';
import * as React from 'react';
import { FaWindowMaximize } from 'react-icons/fa';
import styled from 'styled-components';

import { Theme } from '../Theme';

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
  in_port: {
    id: "in_port",
    type: "top",
    properties: {
      value: "in"
    }
  },
  out_port: {
    id: "out_port",
    type: "bottom",
    properties: {
      value: "out"
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
    | "int"
    | "float"
    | "datetime.timedelta"
    | "datetime.datetime"
    | "callable";
  value?: string;
  default?: string;
  description?: string;
  required?: boolean;
  inheritedFrom?: string;
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

  for (let i = 0; i < properties.parameters.length; i++) {
    if (properties.parameters[i].default) {
      properties.parameters[i].value = properties.parameters[i].default;
    }
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
      <FaWindowMaximize /> {type}
    </Outer>
  );
};
