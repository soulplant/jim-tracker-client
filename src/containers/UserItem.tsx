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
    setUserName,
  }
)(props => {
  return (
    <div className="columns">
      <div className="column is-half is-offset-one-quarter box">
        <EditableText
          value={props.user.name}
          placeholder="(no name)"
          setValue={value => props.setUserName(props.user.id, value)}
        />&nbsp;&mdash;&nbsp;
        <EditableText
          value={props.user.nextTalk}
          placeholder="(untitled)"
          setValue={(value: string) =>
            props.setNextTalkName(props.user.id, value)}
        />
      </div>
    </div>
  );
});
