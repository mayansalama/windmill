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
        {this.props.operators ? (
          [].concat(
            ...this.props.operators.map(
              (operator: IAirflowOperator, i: Number) => (
                <AirflowOperator {...operator} key={`${operator.type}-${i}`} />
              )
            )
          )
        ) : (
          <p>Loading operators...</p>
        )}
      </BaseSidebar>
    );
  }
}
