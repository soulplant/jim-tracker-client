import * as React from 'react';
import { connect } from 'react-redux';
import { State } from '../../types';
import { getAllTalkIds } from '../selectors';
import TalkItem from './TalkItem';

export default connect((state: State) => ({
  talkIds: getAllTalkIds(state),
}))(props => {
  return (
    <ul>
      {props.talkIds.map(talkId =>
        <TalkItem
          key={talkId}
          talkId={talkId}
        /> )}
    </ul>
  );
});
