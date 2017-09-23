import * as React from 'react';
import { State } from '../../types';
import { connect } from 'react-redux';
import { getTalkById, getUserById } from '../selectors';
import { toggleTalk } from '../actions';

export default connect((state: State, ownProps: {talkId: string}) => {
  const talk = getTalkById(state, ownProps.talkId);
  const user = getUserById(state, talk.speakerId);
  return {talk, user};
}, {
  toggleTalk
})(props => {
  return (
    <div>
      {props.talk.name} <i>by</i> {props.user.name}
      <button onClick={() => props.toggleTalk(props.talk.id)}>Click</button>
    </div>
  );
}
);
