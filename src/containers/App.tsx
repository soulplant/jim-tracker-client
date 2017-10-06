import * as React from "react";
import UserList from "./UserList";
import TalkList from "./TalkList";
import NewUserButton from "./NewUserButton";

export default (props: {}) => (
  <div>
    <UserList />
    <TalkList />
    <NewUserButton />
  </div>
);
