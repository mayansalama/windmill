import * as React from "react";
import { AirflowOperator, IAirflowOperator } from ".";
import { SidebarTitle, BaseSidebar } from "../Theme";

export class AirflowPanel extends React.Component<{
  operators: IAirflowOperator[];
}> {
  public render() {
    return (
      <BaseSidebar>
        <SidebarTitle>Operator Library</SidebarTitle>
        {[].concat(
          ...this.props.operators.map((operator: IAirflowOperator) => (
            <AirflowOperator {...operator} />
          ))
        )}
      </BaseSidebar>
    );
  }
}
