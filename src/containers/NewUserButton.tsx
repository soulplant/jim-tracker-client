import * as React from "react";

import { AddUserAction, addUser } from "../actions";

import { TTState } from "../types";
import { connect } from "react-redux";
import { getNextUserId } from "../selectors";

interface Props {
  nextUserId: string;
  addUser(localId: string, name: string): AddUserAction;
}

class NewUserButton extends React.Component<Props, {}> {
  addUser = (event: React.MouseEvent<HTMLElement>) => {
    this.props.addUser(this.props.nextUserId, "(unknown)");
    event.preventDefault();
  };

  render(): JSX.Element {
    return (
      <div className="button is-primary" onClick={this.addUser}>
        Add speaker
      </div>
    );
  }
}

export default connect(
  (state: TTState) => ({
    nextUserId: getNextUserId(state),
  }),
  {
    addUser,
  }
)(NewUserButton);
