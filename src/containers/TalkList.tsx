import * as React from "react";

import { TTState } from "../types";
import TalkItem from "./TalkItem";
import { connect } from "react-redux";
import { getAllTalkIds } from "../selectors";

export default connect((state: TTState) => ({
  talkIds: getAllTalkIds(state),
}))(props => {
  return (
    <div>
      {props.talkIds.map(talkId => <TalkItem key={talkId} talkId={talkId} />)}
    </div>
  );
});
