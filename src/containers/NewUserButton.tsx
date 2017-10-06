import { connect } from "react-redux";
import * as React from "react";
import { ChangeEvent } from "react";
import { getUserText } from "../selectors";
import {
  addUser,
  updateUserText,
  AddUserAction,
  UpdateUserTextAction,
} from "../actions";
import { TTState } from "../types";

interface Props {
  userText: string;
  addUser(name: string): AddUserAction;
  updateUserText(userText: string): UpdateUserTextAction;
}

class NewUserButton extends React.Component<Props, {}> {
  addUser = (event: React.FormEvent<HTMLFormElement>) => {
    this.props.addUser(this.props.userText);
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
  }),
  {
    addUser,
    updateUserText,
  }
)(NewUserButton);
