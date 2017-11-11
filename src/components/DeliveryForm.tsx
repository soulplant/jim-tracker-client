import * as React from "react";
// import { StyleSheet, css } from "aphrodite";

// const styles = StyleSheet.create({
//   disabled: {
//     opacity: 0.5,
//   },
// });

interface OwnProps {
  // The date we are interested in.
  date: Date;

  // The delivery time. Should be on the same date as `date`.
  deliveryTime: Date;
}

// Used to record the date that a delivery is made.
export default class DeliveryForm extends React.Component<OwnProps, {}> {
  input: HTMLInputElement | null;

  constructor(props: OwnProps) {
    super(props);
    this.state = {
      isEditing: false,
      currentValue: "",
    };
  }

  render() {
    return <div>{new Date().toString()}</div>;
  }
}
