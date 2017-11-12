import * as React from "react";
import { connect } from "react-redux";
import { JTState } from "../types";
import { Delivery } from "../actions";
import { getDeliveryHistory, getToday, HistoryWeek } from "../selectors";
import { formatTime } from "../utils";
import * as moment from "moment";

class DeliveryView extends React.Component<
  { today: Date; delivery: Delivery | null },
  {}
> {
  render() {
    if (!this.props.delivery) {
      return <td>-</td>;
    }
    return <td>{formatTime(this.props.today, this.props.delivery.time)}</td>;
  }
}

type Props = {
  today: Date;
  deliveryHistory: HistoryWeek[];
};

class History extends React.Component<Props, {}> {
  render() {
    return (
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <table>
          <tr>
            {this.props.deliveryHistory.map((ds, i) => (
              <th>
                {moment(ds.date)
                  .add(1, "day")
                  .format("ll")}
              </th>
            ))}
          </tr>
          <tbody>
            {[1, 2, 3, 4, 5].map(dayOfWeek => (
              <tr>
                {this.props.deliveryHistory.map((ds, i) => (
                  <DeliveryView
                    today={this.props.today}
                    delivery={ds.deliveries[dayOfWeek]}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = (state: JTState) => ({
  deliveryHistory: getDeliveryHistory(state),
  today: getToday(state),
});

export default connect(mapStateToProps)(History);
