import * as React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { FaGripLinesVertical } from "react-icons/fa";
import { Theme, LeftPanelDefaultWidth } from "../Theme";

const PanelContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0px;
  max-width: 100vw;
  max-height: 100vh;
  box-sizing: border-box;
  font-family: sans-serif;
`;

const Resizer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  width: 15px;
  background: ${Theme.colors.light};
  border: 1px solid ${Theme.colors.lightAccent};
  position: relative;
  cursor: col-Resize;
  &:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    background: ${Theme.colors.lightAccent};
  }
  flex-shrink: 0;
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
`;

const GripLines = styled.div`
  color: darkgray;
  font-size: ${Theme.fonts.normalSize};
`;

const Divider = styled.div`
  width: 1.5px;
  background: ${Theme.colors.lightAccent};
  position: relative;
  flex-shrink: 0;
`;

interface IResizablePanelState {
  initState: boolean;
  isDragging: boolean;
  initialPos: number;
  delta: number;
  panelWidth: number;
}

export class ResizablePanel extends React.Component<
  { initialWidth?: number },
  IResizablePanelState
> {
  eventHandler = null;

  public get initWidth(): number {
    return this.props.initialWidth | LeftPanelDefaultWidth;
  }

  public state = {
    initState: true,
    isDragging: false,
    initialPos: 0,
    delta: 0,
    panelWidth: 0
  };

  public componentDidMount() {
    ReactDOM.findDOMNode(this).addEventListener("mousemove", this.ResizePanel);
    ReactDOM.findDOMNode(this).addEventListener("mouseup", this.stopResize);
    ReactDOM.findDOMNode(this).addEventListener("mouseleave", this.stopResize);
  }

  public startResize = (event: React.MouseEvent) => {
    this.setState({
      initState: false,
      isDragging: true,
      initialPos: event.clientX
    });
  };

  public stopResize = () => {
    if (this.state.isDragging) {
      this.setState(({ delta, initialPos }) => ({
        isDragging: false,
        delta: 0,
        panelWidth: initialPos + delta
      }));
    }
  };

  public ResizePanel = event => {
    if (this.state.isDragging) {
      const delta = event.clientX - this.state.initialPos;
      this.setState({
        delta: delta
      });
    }
  };

  public render() {
    const rest = React.Children.toArray(this.props.children).slice(1);
    return (
      <PanelContainer onMouseUp={() => this.stopResize()}>
        <div
          style={
            this.state.initState
              ? { minWidth: this.initWidth }
              : this.state.isDragging
              ? { minWidth: this.state.initialPos + this.state.delta }
              : { minWidth: this.state.panelWidth }
          }
        >
          {this.props.children[0]}
        </div>
        {[].concat(
          ...rest.map((child, i) => {
            return [
              i == 0 ? (
                <Resizer
                  onMouseDown={e => this.startResize(e)}
                  key={"resizer_" + i}
                >
                  <GripLines key={"grip_lines" + i}>
                    <FaGripLinesVertical key={"grip_lines_ico" + i} />
                  </GripLines>
                </Resizer>
              ) : (
                <Divider key={"divider_" + i} />
              ),
              <div
                key={"panel_" + i}
                className="panel"
                style={i == 0 ? { flex: `1 1 auto`, overflow: `hidden` } : {}}
              >
                {child}
              </div>
            ];
          })
        )}
      </PanelContainer>
    );
  }
}
