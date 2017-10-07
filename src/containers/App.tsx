import * as React from "react";

import { StyleSheet, css } from "aphrodite";

import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import NewUserButton from "./NewUserButton";
import UserList from "./UserList";

const styles = StyleSheet.create({
  container: {
    marginTop: "2em",
  },
});

@DragDropContext(HTML5Backend)
class App extends React.Component<{}, {}> {
  render(): false | JSX.Element | null {
    return (
      <div className={css(styles.container)}>
        <UserList />
        <NewUserButton />
      </div>
    );
  }
}

export default App;
