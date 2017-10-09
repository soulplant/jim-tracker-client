import * as React from "react";

import {
  AddUserAction,
  RepositionUserAction,
  addUser,
  repositionUser,
} from "../actions";
import { TTState, User } from "../types";

import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import UserRow from "./UserRow";
import { connect } from "react-redux";
import { getAllUsers } from "../selectors";

@DragDropContext(HTML5Backend)
class App2 extends React.Component<Props, {}> {
  render(): false | JSX.Element | null {
    return (
      <div className="cc">
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
                  userId={u.id}
                  highlight={i == 0}
                  repositionUser={this.props.repositionUser}
                />
              ))}
            </tbody>
          </table>
          <div className="button-kontainer">
            <a className="button is-primary">Talk complete</a>
            <a
              className="button is-link"
              onClick={() => this.props.addUser("")}
            >
              Add speaker
            </a>
            {/* TODO(james): Clicking this should replace the date field with a delete button. */}
            <a className="button is-link">Edit Schedule</a>
            <button className="button is-link" disabled>
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
  repositionUser(
    movedUserId: string,
    anchorUserId: string,
    before: boolean
  ): RepositionUserAction;
  addUser(name: string): AddUserAction;
}

const mapStateToProps = (state: TTState) => ({
  users: getAllUsers(state),
});

const mapDispatchToProps = {
  repositionUser,
  addUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(App2);
