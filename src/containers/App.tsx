import * as React from "react";

import { JTState } from "../types";
import { connect } from "react-redux";
import DeliveryForm from "../components/DeliveryForm";
import { getIsLoading } from "../selectors";

interface Props {
  isLoading: boolean;
}

interface DispatchProps {}

class App extends React.Component<Props & DispatchProps, {}> {
  render(): false | JSX.Element | null {
    return (
      <div className="cc">
        <h1>Hello {this.props.isLoading ? "..." : ""}</h1>
        <DeliveryForm date={new Date()} deliveryTime={new Date()} />
      </div>
    );
  }
}

const mapStateToProps = (state: JTState): Props => ({
  isLoading: getIsLoading(state),
});

const mapDispatchToProps: DispatchProps = {};

export default connect<Props, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(App);
