import { FlowChart, IChart } from '@mrblenny/react-flow-chart';
import * as actions from '@mrblenny/react-flow-chart/src/container/actions';
import { cloneDeep, mapValues } from 'lodash';
import * as React from 'react';
import { render } from 'react-dom';
import { Content, DragAndDropSidebar, Page, SelectedSidebar } from './components';
import { chartSimple } from './misc/exampleChartState';

export class App extends React.Component {
    public state = cloneDeep(chartSimple)

    public renderSelectedSidebar(chart: IChart, onDeleteKey: Function) {
        return (
            <SelectedSidebar
                chart={chart}
                onDeleteKey={onDeleteKey}
            />
        )
    }

    public render() {
        const chart = this.state
        const stateActions = mapValues(actions, (func: any) =>
            (...args: any) => this.setState(func(...args))) as typeof actions

        return (
            <Page>
                <DragAndDropSidebar />
                <Content>
                    <FlowChart
                        chart={chart}
                        callbacks={stateActions}
                    />
                </Content>
                {this.renderSelectedSidebar(chart, stateActions.onDeleteKey)}
            </Page>
        )
    }
}

render(<App />, document.getElementById('root'))
