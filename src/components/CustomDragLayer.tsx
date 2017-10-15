import * as React from "react";

import { DragLayer, DragLayerMonitor } from "react-dnd";

import { UserDragItem } from "../containers/UserRow";
import UserRow from "../containers/UserRow";

const layerStyles = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
} as {};

function getItemStyles(props: Props) {
  const { currentOffset } = props;
  if (!currentOffset) {
    return {
      display: "none",
    };
  }

  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform: transform,
    WebkitTransform: transform,
  };
}

class CustomDragLayer extends React.Component<Props, {}> {
  renderItem(type: string, item: UserDragItem) {
    return (
      <table
        className="table"
        style={{
          width: "40em",
          transform: "rotate(2deg)",
          border: "solid 1px #dbdbdb",
        }}
      >
        <tbody>
          <UserRow userId={item.userId} highlight={false} />
        </tbody>
      </table>
    );
  }

  render() {
    const { item, itemType, isDragging } = this.props;
    if (!isDragging) {
      return null;
    }

    return (
      <div style={layerStyles}>
        <div style={getItemStyles(this.props)}>
          {this.renderItem(itemType, item)}
        </div>
      </div>
    );
  }
}

interface Props {
  item: UserDragItem;
  itemType: string;
  currentOffset: { x: number; y: number };
  isDragging: boolean;
}

function collect(monitor: DragLayerMonitor): Props {
  return {
    item: monitor.getItem() as UserDragItem,
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  };
}

export default DragLayer(collect)(CustomDragLayer);
