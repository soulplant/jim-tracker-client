import * as React from "react";

import { StyleSheet, css } from "aphrodite";

import EditableText from "./EditableText";

interface OwnProps {
  name: string;
  nextTalkName: string;
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
          />&nbsp;&mdash;&nbsp;
          <EditableText
            value={this.props.nextTalkName}
            placeholder="(untitled)"
            setValue={this.props.setNextTalkName}
          />
        </div>
        <div className={css(styles.buttonContainer)}>
          <a className={"button is-link " + css(styles.button)}>Delete</a>
        </div>
      </div>
    );
  }
}
