import * as React from "react";

import ButtonPanel from "./ButtonPanel";
import ConfirmationDialog from "./ConfirmationDialog";
import CustomDragLayer from "../components/CustomDragLayer";
import LoadingIndicator from "./LoadingIndicator";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { TTState } from "../types";
import TalkScheduleTable from "./TalkScheduleTable";
import { connect } from "react-redux";
import { escapePressed } from "../actions";
import {
  getIsPendingConfirmation,
  getIsInitialFetchPending,
} from "../selectors";

interface Props {
  isPendingConfirmation: boolean;
  isInitialFetchPending: boolean;
}

interface DispatchProps {
  escapePressed: typeof escapePressed;
}

class App extends React.Component<Props & DispatchProps, {}> {
  componentDidMount() {
    window.addEventListener(
      "keyup",
      event => {
        if (event.keyCode === 27) {
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
          <h1 className="title">
            Helix Talk Rotation <LoadingIndicator />
          </h1>
          {!this.props.isInitialFetchPending && <TalkScheduleTable />}
          {!this.props.isInitialFetchPending && <ButtonPanel />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: TTState): Props => ({
  isPendingConfirmation: getIsPendingConfirmation(state),
  isInitialFetchPending: getIsInitialFetchPending(state),
});

const mapDispatchToProps: DispatchProps = {
  escapePressed,
};

export default DragDropContext(HTML5Backend)(
  connect<Props, DispatchProps>(mapStateToProps, mapDispatchToProps)(App)
);
