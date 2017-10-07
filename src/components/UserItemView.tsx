import * as React from "react";

import EditableText from "./EditableText";

interface OwnProps {
  name: string;
  nextTalkName: string;
  setUserName(userName: string): void;
  setNextTalkName(talkName: string): void;
}

export default class UserItemView extends React.Component<OwnProps, {}> {
  render() {
    return (
      <div>
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
    );
  }
}
