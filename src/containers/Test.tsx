import * as React from "react";

import { DispatchProp, connect } from "react-redux";

const Foo = class extends React.Component<DispatchProp<any>, {}> {
  render() {
    return <div>Hi</div>;
  }
};
@connect()
class FooBar extends React.Component<DispatchProp<any>, {}> {
  render(): any {
    return <div>hi</div>;
  }
}
