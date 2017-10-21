import * as React from "react";

import { User } from "../types";
import UserRow from "./UserRow";
import { connect } from "react-redux";
import { getAllUsers } from "../selectors";

type Props = {
  users: User[];
};

class TalkScheduleTable extends React.Component<Props, {}> {
  render() {
    return (
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: "10em" }}>Speaker</th>
            <th>Talk</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {this.props.users.map((u, i) => (
            <UserRow key={u.id} userId={u.id} highlight={i === 0} />
          ))}
        </tbody>
      </table>
    );
  }
}

export default connect(state => ({
  users: getAllUsers(state),
}))(TalkScheduleTable);
