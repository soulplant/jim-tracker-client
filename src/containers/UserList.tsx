import * as React from "react";

import { TTState } from "../types";
import UserItem from "./UserItem";
import { connect } from "react-redux";
import { getAllUserIds } from "../selectors";

export default connect((state: TTState) => ({
  userIds: getAllUserIds(state),
}))(props => (
  <div>
    {props.userIds.map(userId => <UserItem key={userId} userId={userId} />)}
  </div>
));
