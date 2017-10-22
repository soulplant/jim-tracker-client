import * as React from "react";

import { StyleSheet, css } from "aphrodite";

import EditableText from "./EditableText";

interface OwnProps {
  name: string;
  nextTalkName: string;

  // Whether or not this user is being confirmed on the server right now.
  // TODO(james): We only need to show this to prevent interactions so that when
  // we update the local id in the client we don't lose our intermediate state.
  // We should figure out a way of handling local ids that doesn't cause react
  // to unmount / remount us.
  isLoading: boolean;
  setUserName(userName: string): void;
  setNextTalkName(talkName: string): void;
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "space-between",
  },
  textContainer: {
    display: "flex",
    alignItems: "center",
  },
  buttonContainer: {
    display: "flex",
  },
  button: {
    alignSelf: "flex-end",
  },
  hide: {
    display: "none",
  },
});

export default class UserItemView extends React.Component<OwnProps, {}> {
  render() {
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.textContainer)}>
          <EditableText
            value={this.props.name}
            placeholder="(no name)"
            setValue={this.props.setUserName}
            disabled={this.props.isLoading}
          />&nbsp;&mdash;&nbsp;
          <EditableText
            value={this.props.nextTalkName}
            placeholder="(untitled)"
            setValue={this.props.setNextTalkName}
            disabled={this.props.isLoading}
          />
        </div>
        <div className={css(styles.buttonContainer)}>
          <a className={"button is-link " + css(styles.button)}>Delete</a>
        </div>
      </div>
    );
  }
}
