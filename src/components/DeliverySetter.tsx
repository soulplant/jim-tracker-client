import * as React from "react";
import * as moment from "moment";

type Props = {
  date: Date;
  onDeliverySet: (date: Date) => void;
};

class DeliverySetter extends React.Component<Props, {}> {
  input: HTMLInputElement | null = null;

  render() {
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          const dateText = this.input!.value;
          const date = moment(dateText + "pm", "hhmmA");
          const currentDate = moment(this.props.date);
          [
            "date",
            "month",
            "year",
          ].forEach((unit: "date" | "month" | "year") => {
            console.log("currentDate " + unit + " = " + currentDate.get(unit));
            date.set(unit, currentDate.get(unit));
          });
          this.props.onDeliverySet(date.toDate());
          this.input!.value = "";
        }}
      >
        <input
          ref={elem => (this.input = elem)}
          className="input"
          type="text"
          onSubmit={() => console.log("hi")}
        />
      </form>
    );
  }
}

export default DeliverySetter;
