import * as React from "react";
import { connect } from "react-redux";
import { getUserById } from "../selectors";
import { scheduleNewTalk, setNextTalkName } from "../actions";
import { TTState } from "../types";
import EditableText from "../components/EditableText";

interface OwnProps {
  userId: string;
}

export default connect(
  (state: TTState, ownProps: OwnProps) => ({
    user: getUserById(state, ownProps.userId),
  }),
  {
    scheduleNewTalk,
    setNextTalkName,
  }
)(props => {
  return (
    <div className="columns">
      <div className="column is-half is-offset-one-quarter box">
        {props.user.name}&nbsp;&mdash;&nbsp;
        <EditableText
          value={props.user.nextTalk}
          setValue={(value: string) =>
            props.setNextTalkName(props.user.id, value)}
        />
      </div>
    </div>
  );
});
