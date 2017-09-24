import * as React from 'react';
import { TTState, Talk, User } from '../types';
import { connect } from 'react-redux';
import { getTalkById, getUserById } from '../selectors';
import {
  toggleTalk,
  ToggleTalkAction,
  SetTalkNameAction,
  setTalkName
} from '../actions';

interface OwnProps {
  talkId: string;
}

interface Props {
  talk: Talk;
  user: User;
  toggleTalk: (talkId: string) => ToggleTalkAction;
  setTalkName: (talkId: string, talkName: string) => SetTalkNameAction;
}

interface State {
  isEditing: boolean;
  currentName: string;
}

class TalkItem extends React.Component<Props & OwnProps, State> {
  constructor(props: Props & OwnProps) {
    super(props);
    this.state = {
      isEditing: false,
      currentName: ''
    };
  }

  startEditing = () => {
    this.setState({ isEditing: true, currentName: this.props.talk.name });
  };

  finishEditing = () => {
    this.setState({ isEditing: false });
    this.props.setTalkName(this.props.talkId, this.state.currentName);
  };

  cancelEditing = () => {
    this.setState({ isEditing: false });
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ currentName: event.target.value });
  };

  handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.charCode === 13) {
      this.finishEditing();
    }
  };

  handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 27) {
      this.cancelEditing();
    }
  };

  render() {
    return (
      <div>
        <input
          type="checkbox"
          checked={this.props.talk.done}
          onChange={() => this.props.toggleTalk(this.props.talk.id)}
        />
        {this.state.isEditing ? (
          <input
            autoFocus={true}
            type="text"
            value={this.state.currentName}
            onChange={this.handleChange}
            onKeyPress={event => this.handleKeyPress(event)}
            onKeyUp={event => this.handleKeyUp(event)}
          />
        ) : (
          <span onClick={this.startEditing}>{this.props.talk.name}</span>
        )}
        &nbsp;<i>by</i>&nbsp;
        {this.props.user.name}
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
    setTalkName
  }
)(TalkItem);
