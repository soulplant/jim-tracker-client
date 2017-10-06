import * as React from "react";

import {
  SetTalkNameAction,
  ToggleTalkAction,
  setTalkName,
  toggleTalk,
} from "../actions";
import { TTState, Talk, User } from "../types";
import { getTalkById, getUserById } from "../selectors";

import EditableText from "../components/EditableText";
import { connect } from "react-redux";

interface OwnProps {
  talkId: string;
}

interface Props {
  talk: Talk;
  user: User;
  toggleTalk: (talkId: string) => ToggleTalkAction;
  setTalkName: (talkId: string, talkName: string) => SetTalkNameAction;
}

interface State {}

class TalkItem extends React.Component<Props & OwnProps, State> {
  constructor(props: Props & OwnProps) {
    super(props);
  }

  render() {
    return (
      <div className="columns">
        <div className="column is-half is-offset-one-quarter box">
          <input
            type="checkbox"
            checked={this.props.talk.done}
            onChange={() => this.props.toggleTalk(this.props.talk.id)}
          />
          <EditableText
            value={this.props.talk.name}
            setValue={(value: string) =>
              this.props.setTalkName(this.props.talkId, value)}
          />
          &nbsp;<i>by</i>&nbsp;
          {this.props.user.name}
        </div>
      </div>
    );
  }
}

export default connect(
  (state: TTState, ownProps: { talkId: string }) => {
    const talk = getTalkById(state, ownProps.talkId);
    const user = getUserById(state, talk.speakerId);
    return { talk, user };
  },
  {
    toggleTalk,
    setTalkName,
  }
)(TalkItem);
