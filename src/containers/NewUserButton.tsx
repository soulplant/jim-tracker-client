import * as React from "react";

import {
  AddUserAction,
  UpdateUserTextAction,
  addUser,
  updateUserText,
} from "../actions";
import { getNextUserId, getUserText } from "../selectors";

import { ChangeEvent } from "react";
import { TTState } from "../types";
import { connect } from "react-redux";

interface Props {
  nextUserId: string;
  userText: string;
  addUser(localId: string, name: string): AddUserAction;
  updateUserText(userText: string): UpdateUserTextAction;
}

class NewUserButton extends React.Component<Props, {}> {
  addUser = (event: React.FormEvent<HTMLFormElement>) => {
    this.props.addUser(this.props.nextUserId, this.props.userText);
    event.preventDefault();
  };

  handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();
    this.props.updateUserText(event.target.value);
  };

  render(): JSX.Element {
    return (
      <form onSubmit={this.addUser}>
        <input
          type="text"
          onChange={this.handleChange}
          value={this.props.userText}
        />
      </form>
    );
  }
}

export default connect(
  (state: TTState) => ({
    userText: getUserText(state),
    nextUserId: getNextUserId(state),
  }),
  {
    addUser,
    updateUserText,
  }
)(NewUserButton);
