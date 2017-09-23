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
      <input
        type="checkbox"
        checked={props.talk.done}
        onChange={() => props.toggleTalk(props.talk.id)}
      />
      {props.talk.name} <i>by</i> {props.user.name}
    </div>
  );
});
