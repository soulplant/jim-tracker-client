import * as React from "react";
import { StyleSheet, css } from "aphrodite";
import { formatDate } from "../utils";
import { LocalTime } from "../types";

const styles = StyleSheet.create({
  container: {},
});

interface OwnProps {
  // The date we are interested in.
  date: Date;
  time: LocalTime | null;

  onNext: () => void;
  onPrevious: () => void;
  onGoToToday: () => void;
}

// Used to record the date that a delivery is made.
export default class DeliveryForm extends React.Component<OwnProps, {}> {
  constructor(props: OwnProps) {
    super(props);
    this.state = {
      isEditing: false,
      currentValue: "",
    };
  }

  render() {
    return (
      <div className={css(styles.container)}>
        <button onClick={this.props.onPrevious}>Left</button>
        {formatDate(this.props.date)}
        <p>
          {this.props.time ? JSON.stringify(this.props.time) : "not set yet"}
        </p>
        <button onClick={this.props.onNext}>Right</button>
        <button onClick={this.props.onGoToToday}>Today</button>
      </div>
    );
  }
}
