import * as React from "react";

import {
  ConfirmationReceivedAction,
  ConfirmationRejectedAction,
  TTAction,
  confirmationReceived,
  confirmationRejected,
} from "../actions";
import {
  getConfirmationAction,
  getConfirmationMessage,
  getConfirmationTitle,
} from "../selectors";

import { TTState } from "../types";
import { connect } from "react-redux";

interface Props {
  title: string;
  message: string;
  action: TTAction;
}

interface DispatchProps {
  confirmationReceived(action: TTAction): ConfirmationReceivedAction;
  confirmationRejected(): ConfirmationRejectedAction;
}

const mapStateToProps = (state: TTState): Props => ({
  title: getConfirmationTitle(state),
  message: getConfirmationMessage(state),
  action: getConfirmationAction(state),
});

const mapDispatchToProps: DispatchProps = {
  confirmationReceived,
  confirmationRejected,
};

class ConfirmationDialog extends React.Component<Props & DispatchProps, {}> {
  confirmationReceived = () =>
    this.props.confirmationReceived(this.props.action);

  render() {
    return (
      <div className="modal is-active">
        <div className="modal-background" />
        <div className="modal-content">
          <div className="box content">
            <h2>{this.props.title || "Please Confirm"}</h2>
            <p>{this.props.message}</p>
            <br />
            <div>
              <div
                style={{ marginRight: "1em" }}
                className="button is-primary"
                onClick={this.confirmationReceived}
              >
                Ok
              </div>
              <div className="button" onClick={this.props.confirmationRejected}>
                Cancel
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmationDialog);
