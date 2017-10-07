import * as React from "react";

import {
  ConnectDropTarget,
  DragLayerMonitor,
  DragSource,
  DragSourceConnector,
  DropTarget,
  DropTargetConnector,
  DropTargetMonitor,
  DropTargetSpec,
} from "react-dnd";
import {
  ScheduleNewTalkAction,
  SetNextTalkNameAction,
  SetUserNameAction,
  scheduleNewTalk,
  setNextTalkName,
  setUserName,
} from "../actions";
import { TTState, User } from "../types";

import UserItemView from "../components/UserItemView";
import { compose } from "redux";
import { connect } from "react-redux";
import { getUserById } from "../selectors";

interface OwnProps {
  userId: string;
}

interface DragSourceProps {
  connectDragSource: Function;
  isDragging: boolean;
}

interface DropTargetProps {
  connectDropTarget: ConnectDropTarget;
  isOver: boolean;
  canDrop: boolean;
}

interface Props {
  user: User;
  scheduleNewTalk(userId: string): ScheduleNewTalkAction;
  setUserName(userId: string, name: string): SetUserNameAction;
  setNextTalkName(userId: string, talkName: string): SetNextTalkNameAction;
}

const mapStateToProps = (state: TTState, ownProps: OwnProps) => ({
  user: getUserById(state, ownProps.userId),
});

const mapDispatchToProps = {
  scheduleNewTalk,
  setNextTalkName,
  setUserName,
};

const ItemTypes: { [id: string]: string } = {
  USER: "user",
};

type UserDragItem = {
  type: typeof ItemTypes.USER;
  userId: string;
};

const userSource = {
  beginDrag(props: OwnProps): UserDragItem {
    return { type: ItemTypes.USER, userId: props.userId };
  },
};

const dropTarget: DropTargetSpec<OwnProps> = {
  canDrop(props: OwnProps, monitor: DropTargetMonitor) {
    const userId = (monitor.getItem() as UserDragItem).userId;
    return userId !== props.userId;
  },
  drop(props: OwnProps, monitor: DropTargetMonitor, component: UserItem) {
    const dy = monitor.getDifferenceFromInitialOffset().y;
    const direction = dy > 0 ? "above" : "below";
    console.log("direction", direction);
    console.log("props", JSON.stringify(props));
    console.log("dropped!", JSON.stringify(monitor.getItem()));
  },
};

function dropTargetCollect(
  connector: DropTargetConnector,
  monitor: DropTargetMonitor
): Object {
  return {
    connectDropTarget: connector.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  };
}

function dragSourceCollect(
  connector: DragSourceConnector,
  monitor: DragLayerMonitor
) {
  return {
    connectDragSource: connector.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

class UserItem extends React.Component<
  Props & OwnProps & DragSourceProps & DropTargetProps,
  {}
> {
  render() {
    const dragItem = this.props.connectDragSource(
      <div className="column is-half is-offset-one-quarter box">
        {this.props.isDragging && !this.props.canDrop && "o"}
        {this.props.isOver && "*"}
        <UserItemView
          name={this.props.user.name}
          nextTalkName={this.props.user.nextTalk}
          setUserName={value =>
            this.props.setUserName(this.props.user.id, value)}
          setNextTalkName={value =>
            this.props.setNextTalkName(this.props.user.id, value)}
        />
      </div>
    );
    return (
      <div className="columns">{this.props.connectDropTarget(dragItem)}</div>
    );
  }
}

export default compose(
  DropTarget(ItemTypes.USER, dropTarget, dropTargetCollect),
  DragSource(ItemTypes.USER, userSource, dragSourceCollect),
  connect(mapStateToProps, mapDispatchToProps)
)(UserItem);
