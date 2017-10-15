import * as React from "react";

import {
  AddUserAction,
  EndEditModeAction,
  RepositionUserAction,
  StartEditModeAction,
  addUser,
  completeTalk,
  confirmationRequested,
  endEditMode,
  repositionUser,
  startEditMode,
} from "../actions";
import { Dispatch, bindActionCreators } from "redux";
import { TTState, User } from "../types";
import {
  getAllUsers,
  getIsEditMode,
  getIsPendingConfirmation,
  getNextUserId,
} from "../selectors";

import ConfirmationDialog from "./ConfirmationDialog";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import UserRow from "./UserRow";
import { connect } from "react-redux";

class App extends React.Component<Props & DispatchProps, {}> {
  completeTalk = () => this.props.completeTalk(this.props.users[0].id);

  render(): false | JSX.Element | null {
    return (
      <div className="cc">
        {this.props.isPendingConfirmation && <ConfirmationDialog />}
        <div className="kontainer">
          <h1 className="title">Helix Talk Rotation</h1>
          <table className="table">
            <thead>
              <tr>
                <th>Speaker</th>
                <th>Talk</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {this.props.users.map((u, i) => (
                <UserRow
                  key={u.id}
                  userId={u.id}
                  highlight={i === 0}
                  repositionUser={this.props.repositionUser}
                />
              ))}
            </tbody>
          </table>
          <div className="button-kontainer">
            <a className="button is-primary" onClick={this.completeTalk}>
              Talk complete
            </a>
            <a
              className="button is-link"
              onClick={() => this.props.addUser(this.props.nextUserId, "")}
            >
              Add speaker
            </a>
            {/* TODO(james): Clicking this should replace the date field with a delete button. */}

            {!this.props.isEditMode ? (
              <a className="button is-link" onClick={this.props.startEditMode}>
                Edit Schedule
              </a>
            ) : (
              <a className="button is-danger" onClick={this.props.endEditMode}>
                Edit Schedule
              </a>
            )}
            <button className="button is-link" disabled={true}>
              History
            </button>
          </div>
        </div>
      </div>
    );
  }
}

interface Props {
  users: User[];
  nextUserId: string;
  isEditMode: boolean;
  isPendingConfirmation: boolean;
}

interface DispatchProps {
  repositionUser(
    movedUserId: string,
    anchorUserId: string,
    before: boolean
  ): RepositionUserAction;
  addUser(localId: string, name: string): AddUserAction;
  completeTalk(userId: string): void;
  startEditMode(): StartEditModeAction;
  endEditMode(): EndEditModeAction;
}

const mapStateToProps = (state: TTState): Props => ({
  users: getAllUsers(state),
  nextUserId: getNextUserId(state),
  isPendingConfirmation: getIsPendingConfirmation(state),
  isEditMode: getIsEditMode(state),
});

const mapDispatchToProps = (dispatch: Dispatch<TTState>): DispatchProps => ({
  completeTalk(userId: string) {
    dispatch(confirmationRequested(completeTalk(userId)));
  },
  ...bindActionCreators(
    {
      repositionUser,
      addUser,
      startEditMode,
      endEditMode,
    },
    dispatch
  ),
});

export default DragDropContext(HTML5Backend)(
  connect<Props, DispatchProps>(mapStateToProps, mapDispatchToProps)(App)
);
