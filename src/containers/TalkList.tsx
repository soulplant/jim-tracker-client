import * as React from 'react';
import { connect } from 'react-redux';
import { TTState } from '../types';
import { getAllTalkIds } from '../selectors';
import TalkItem from './TalkItem';

export default connect((state: TTState) => ({
  talkIds: getAllTalkIds(state)
}))(props => {
  return (
    <div>
      {props.talkIds.map(talkId => <TalkItem key={talkId} talkId={talkId} />)}
    </div>
  );
});
