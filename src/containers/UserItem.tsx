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
  RepositionUserAction,
  ScheduleNewTalkAction,
  SetNextTalkNameAction,
  SetUserNameAction,
  scheduleNewTalk,
  setNextTalkName,
  setUserName,
} from "../actions";
import { StyleSheet, css } from "aphrodite";
import { TTState, User } from "../types";

import UserItemView from "../components/UserItemView";
import { compose } from "redux";
import { connect } from "react-redux";
import { getUserById } from "../selectors";

interface OwnProps {
  userId: string;
  repositionUser(
    movedUserId: string,
    anchorUserId: string,
    before: boolean
  ): RepositionUserAction;
}

interface DragSourceProps {
  connectDragSource: Function;
  isDragging: boolean;
}

interface DropTargetProps {
  connectDropTarget: ConnectDropTarget;
  isOver: boolean;
  canDrop: boolean;
  isBefore: boolean;
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
  drop(props: OwnProps, monitor: DropTargetMonitor) {
    const dy = monitor.getDifferenceFromInitialOffset().y;
    const before = dy < 0;
    const item = monitor.getItem() as UserDragItem;
    props.repositionUser(item.userId, props.userId, before);
  },
};

function dropTargetCollect(
  connector: DropTargetConnector,
  monitor: DropTargetMonitor
): Object {
  const offset = monitor.getDifferenceFromInitialOffset();
  return {
    connectDropTarget: connector.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    isBefore: offset && offset.y < 0,
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

const styles = StyleSheet.create({
  regular: {
    marginTop: 2,
    marginBottom: 2,
  },
  dragging: {
    opacity: 0.5,
    backgroundColor: "#eee",
  },
  dragBefore: {
    borderTop: "2px solid black",
    marginTop: 0,
  },
  dragAfter: {
    borderBottom: "2px solid black",
    marginBottom: 0,
  },
});

class UserItem extends React.Component<
  Props & OwnProps & DragSourceProps & DropTargetProps,
  {}
> {
  render() {
    const dragItem = this.props.connectDragSource(
      <div
        className={
          "column is-half is-offset-one-quarter box " +
          css(
            styles.regular,
            this.props.isDragging && styles.dragging,
            this.props.isOver &&
              (this.props.isBefore ? styles.dragBefore : styles.dragAfter)
          )
        }
      >
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
