import * as React from "react";

import { StyleSheet, css } from "aphrodite";

import NewUserButton from "./NewUserButton";
import UserList from "./UserList";

const styles = StyleSheet.create({
  container: {
    marginTop: "2em",
  },
});

export default (props: {}) => (
  <div className={css(styles.container)}>
    <UserList />
    <NewUserButton />
  </div>
);
