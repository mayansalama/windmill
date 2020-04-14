import { IPortDefaultProps } from '@mrblenny/react-flow-chart';
import * as React from 'react';
import { FaChevronDown, FaCircle, FaQuestion } from 'react-icons/fa';
import styled from 'styled-components';

import { Theme } from '../Theme';

const PortDefaultOuter = styled.div`
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  padding: 3px;
  border: 1px solid ${Theme.colors.brand};
  background: ${Theme.colors.light};
`;

export const OperatorPort = (props: IPortDefaultProps) => (
  <PortDefaultOuter>
    {props.port.properties && props.port.properties.value === "in" && (
      <FaCircle size="10px" color={Theme.colors.dark} />
    )}
    {props.port.properties && props.port.properties.value === "out" && (
      <FaChevronDown size="16px" color={Theme.colors.dark} />
    )}
    {!props.port.properties && (
      <FaQuestion size="8px" color={Theme.colors.dark} />
    )}
  </PortDefaultOuter>
);
