import * as React from "react";

import { TTState } from "../types";
import UserItem from "./UserItem";
import { connect } from "react-redux";
import { getAllUserIds } from "../selectors";
import { repositionUser } from "../actions";

export default connect(
  (state: TTState) => ({
    userIds: getAllUserIds(state),
  }),
  {
    repositionUser,
  }
)(props => (
  <div>
    {props.userIds.map(userId => (
      <UserItem
        key={userId}
        userId={userId}
        repositionUser={props.repositionUser}
      />
    ))}
  </div>
));
