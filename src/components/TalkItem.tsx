import * as React from 'react';
import { Talk, User } from '../../types';

interface Props {
  talk: Talk;
  user: User;
  onClick: () => void;
}

export default class TalkItem extends React.Component<Props, {}> {
  render() {
    return (
      <div>
        {this.props.talk.name} <i>by</i> {this.props.user.name}
        <button onClick={this.props.onClick}>Click</button>
      </div>
    );
  }
}