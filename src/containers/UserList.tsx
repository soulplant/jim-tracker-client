import { connect } from "react-redux";
import * as React from "react";
import { TTState } from "../types";
import { getAllUserIds } from "../selectors";
import UserItem from "./UserItem";

export default connect((state: TTState) => ({
  userIds: getAllUserIds(state)
}))(props => {
  return (
    <ul>
      {props.userIds.map(userId => (
        <li>
          <UserItem userId={userId} />
        </li>
      ))}
    </ul>
  );
});
