import { connect } from "react-redux";
import * as React from "react";
import { TTState } from "../types";
import { getAllUserIds } from "../selectors";
import UserItem from "./UserItem";

export default connect((state: TTState) => ({
  userIds: getAllUserIds(state),
}))(props => (
  <div>
    {props.userIds.map(userId => <UserItem key={userId} userId={userId} />)}
  </div>
));
