import * as React from "react";

interface OwnProps {
  value: string;
  setValue: (value: string) => void;
}

interface State {
  isEditing: boolean;
  currentValue: string;
}

// A text label that when clicked on becomes editable.
export default class EditableText extends React.Component<OwnProps, State> {
  constructor(props: OwnProps) {
    super(props);
    this.state = {
      isEditing: false,
      currentValue: "",
    };
  }

  startEditing = () => {
    this.setState({ isEditing: true, currentValue: this.props.value });
  };

  finishEditing = () => {
    this.setState({ isEditing: false });
    this.props.setValue(this.state.currentValue);
  };

  cancelEditing = () => {
    this.setState({ isEditing: false });
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ currentValue: event.target.value });
  };

  handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.charCode === 13) {
      this.finishEditing();
    }
  };

  handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 27) {
      this.cancelEditing();
    }
  };

  render() {
    return this.state.isEditing ? (
      <input
        autoFocus={true}
        type="text"
        value={this.state.currentValue}
        onChange={this.handleChange}
        onKeyPress={event => this.handleKeyPress(event)}
        onKeyUp={event => this.handleKeyUp(event)}
      />
    ) : (
      <span onClick={this.startEditing}>{this.props.value}</span>
    );
  }
}
