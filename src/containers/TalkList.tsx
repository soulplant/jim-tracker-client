import * as React from 'react';
import { connect } from 'react-redux';
import { State } from '../../types';
import { getAllTalks, getUsersById } from '../selectors';
import TalkItem from '../components/TalkItem';
import { increment } from '../actions';

export default connect((state: State) => ({
  talks: getAllTalks(state),
  users: getUsersById(state),
}), {
  increment,
})(props => {
  return (
    <ul>
      {props.talks.map(talk =>
        <TalkItem
          key={talk.id}
          talk={talk}
          user={props.users[talk.speakerId]}
          onClick={props.increment}
        /> )}
    </ul>
  );
});
