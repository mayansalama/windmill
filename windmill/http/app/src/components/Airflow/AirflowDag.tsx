import React from "react";
import { cloneDeep } from "lodash";
import { Outer, RenderedAirflowParameter, SectionTitle } from "./AirflowNode";
import { IAirflowOperatorParameter } from ".";

export interface IAirflowDagParameter extends IAirflowOperatorParameter {}

export interface IAirflowDag {
  description: string;
  parameters: IAirflowDagParameter[];
}

export class RenderedAirflowDagAsForm extends React.Component<{
  dagProps: IAirflowDag;
  updateParams: Function;
}> {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(params: IAirflowDagParameter, index: number) {
    const newProps = cloneDeep(this.props.dagProps);
    newProps["parameters"][index] = params;
    this.props.updateParams(newProps);
  }

  public render() {
    return (
      <Outer>
        <SectionTitle>Parameters</SectionTitle>
        {[].concat(
          ...this.props.dagProps.parameters.map((p, i) => {
            return [
              <div>
                <RenderedAirflowParameter
                  params={p}
                  key={`${p.id}-${i}`}
                  updateFunc={this.handleChange}
                  index={i}
                />
                <br key={`${p.id}-${i}-br`} />
              </div>
            ];
          })
        )}
      </Outer>
    );
  }
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
          <RenderedAirflowDagAsForm
            dagProps={this.props.dagProps}
            updateParams={this.handleParameterUpdate}
          />
        ) : (
          <p>Loading default DAG props</p>
        )}
      </div>
    );
  }
}
