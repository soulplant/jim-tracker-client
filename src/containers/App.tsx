import * as React from "react";

import { JTState, LocalTime } from "../types";
import { connect } from "react-redux";
import DeliveryForm from "../components/DeliveryForm";
import { getIsLoading, getDate, getTime } from "../selectors";
import { previousDate, nextDate, recordDelivery, goToToday } from "../actions";

interface Props {
  isLoading: boolean;
  date: Date;
  time: LocalTime | null;
}

interface DispatchProps {
  previousDate: typeof previousDate;
  nextDate: typeof nextDate;
  recordDelivery: typeof recordDelivery;
  goToToday: typeof goToToday;
}

class App extends React.Component<Props & DispatchProps, {}> {
  render(): false | JSX.Element | null {
    return (
      <div className="cc">
        <h1>Hello {this.props.isLoading ? "..." : ""}</h1>
        <DeliveryForm
          date={this.props.date}
          time={this.props.time}
          onPrevious={this.props.previousDate}
          onNext={this.props.nextDate}
          onGoToToday={this.props.goToToday}
        />
        <button onClick={this.props.recordDelivery}>Record Delivery</button>
      </div>
    );
  }
}

const mapStateToProps = (state: JTState): Props => ({
  isLoading: getIsLoading(state),
  date: getDate(state),
  time: getTime(state),
});

const mapDispatchToProps: DispatchProps = {
  previousDate,
  nextDate,
  recordDelivery,
  goToToday,
};

export default connect<Props, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(App);
