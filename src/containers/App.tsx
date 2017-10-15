import * as React from "react";

import ButtonPanel from "./ButtonPanel";
import ConfirmationDialog from "./ConfirmationDialog";
import CustomDragLayer from "../components/CustomDragLayer";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { TTState } from "../types";
import TalkScheduleTable from "./TalkScheduleTable";
import { connect } from "react-redux";
import { escapePressed } from "../actions";
import { getIsPendingConfirmation } from "../selectors";

interface Props {
  isPendingConfirmation: boolean;
}

interface DispatchProps {
  escapePressed: typeof escapePressed;
}

class App extends React.Component<Props & DispatchProps, {}> {
  componentDidMount() {
    window.addEventListener(
      "keyup",
      event => {
        if (event.keyCode == 27) {
          this.props.escapePressed();
        }
      },
      false
    );
  }

  render(): false | JSX.Element | null {
    return (
      <div className="cc">
        <CustomDragLayer />
        {this.props.isPendingConfirmation && <ConfirmationDialog />}
        <div className="kontainer">
          <h1 className="title">Helix Talk Rotation</h1>
          <TalkScheduleTable />
          <ButtonPanel />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: TTState): Props => ({
  isPendingConfirmation: getIsPendingConfirmation(state),
});

const mapDispatchToProps: DispatchProps = {
  escapePressed,
};

export default DragDropContext(HTML5Backend)(
  connect<Props, DispatchProps>(mapStateToProps, mapDispatchToProps)(App)
);
