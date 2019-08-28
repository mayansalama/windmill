import React from "react";
import { RenderedAirflowParametersAsForm } from "./AirflowNode";
import { IAirflowOperatorParameter } from ".";

export interface IAirflowDagParameter extends IAirflowOperatorParameter {}

export interface IAirflowDag {
  description: string;
  parameters: IAirflowDagParameter[];
}

export class AirflowDagParams extends React.Component<{
  dagProps: IAirflowDag;
  updateDagProps: Function;
}> {
  constructor(props) {
    super(props);
    this.handleParameterUpdate = this.handleParameterUpdate.bind(this);
  }

  handleParameterUpdate(newProps: IAirflowDag) {
    this.props.updateDagProps(newProps);
  }

  public render() {
    return (
      <div>
        {this.props.dagProps ? (
          <RenderedAirflowParametersAsForm
            properties={this.props.dagProps}
            updateFunc={this.handleParameterUpdate}
            nameField="dag_id"
          />
        ) : (
          <p style={{ marginLeft: "15px" }}>Loading default DAG props</p>
        )}
      </div>
    );
  }
}
