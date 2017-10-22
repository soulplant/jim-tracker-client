import { connect } from "react-redux";
import * as React from "react";
import { getIsLoading } from "../selectors";
import { TTState } from "../types";

class LoadingIndicator extends React.Component<{ isLoading: boolean }, {}> {
  render() {
    return this.props.isLoading ? (
      <span style={{ fontSize: "14px" }}>loading...</span>
    ) : null;
  }
}

export default connect(
  (state: TTState) => ({
    isLoading: getIsLoading(state),
  }),
  {}
)(LoadingIndicator);
