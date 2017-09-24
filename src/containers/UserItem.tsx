import * as React from 'react';
import { connect } from 'react-redux';
import { getUserById } from '../selectors';
import { scheduleNewTalk } from '../actions';
import { TTState } from '../types';

interface OwnProps {
  userId: string;
}

export default connect(
  (state: TTState, ownProps: OwnProps) => ({
    user: getUserById(state, ownProps.userId)
  }),
  (dispatch, ownProps: OwnProps) => ({
    scheduleNewTalk: (): {} => dispatch(scheduleNewTalk(ownProps.userId))
  })
)(props => {
  return <span onClick={props.scheduleNewTalk}>{props.user.name}</span>;
});
