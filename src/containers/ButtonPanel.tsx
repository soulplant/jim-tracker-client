import * as React from "react";

import { Dispatch, bindActionCreators } from "redux";
import { TTState, User } from "../types";
import {
  addUser,
  completeTalk,
  confirmationRequested,
  endEditMode,
  escapePressed,
  startEditMode,
} from "../actions";
import {
  getAllUsers,
  getIsEditMode,
  getIsPendingConfirmation,
  getNextUserId,
} from "../selectors";

import { connect } from "react-redux";

interface Props {
  users: User[];
  nextUserId: string;
  isEditMode: boolean;
  isPendingConfirmation: boolean;
}

interface DispatchProps {
  addUser: typeof addUser;
  startEditMode: typeof startEditMode;
  endEditMode: typeof endEditMode;
  escapePressed: typeof escapePressed;

  // TODO(james): Don't invent this, just use the action creator for
  // confirmationRequested().
  completeTalk(userId: string, userName: string): void;
}

class ButtonPanel extends React.Component<Props & DispatchProps, {}> {
  completeTalk = () => {
    const user = this.props.users[0];
    return this.props.completeTalk(user.id, user.name);
  };

  render() {
    return (
      <div className="button-kontainer">
        <button
          className="button is-primary"
          disabled={this.props.isEditMode || this.props.users.length === 0}
          onClick={this.completeTalk}
        >
          Talk Complete
        </button>
        <a
          className="button is-link"
          onClick={() => this.props.addUser(this.props.nextUserId, "")}
        >
          Add Speaker
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
    );
  }
}

const mapStateToProps = (state: TTState): Props => ({
  users: getAllUsers(state),
  nextUserId: getNextUserId(state),
  isPendingConfirmation: getIsPendingConfirmation(state),
  isEditMode: getIsEditMode(state),
});

const mapDispatchToProps = (dispatch: Dispatch<TTState>): DispatchProps => ({
  completeTalk(userId: string, userName: string) {
    dispatch(
      confirmationRequested(
        completeTalk(userId),
        "Please Confirm",
        "Mark " + addApostropheS(userName) + " talk as done?"
      )
    );
  },
  ...bindActionCreators(
    {
      addUser,
      startEditMode,
      endEditMode,
      escapePressed,
    },
    dispatch
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ButtonPanel);

// Adds an "'s" to names, handling the 's' suffix anomaly.
const addApostropheS = (name: string): string => {
  if (name[name.length - 1] === "s") {
    return name + "'";
  }
  return name + "'s";
};
