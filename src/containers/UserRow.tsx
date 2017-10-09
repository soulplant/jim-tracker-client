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
  SetNextTalkNameAction,
  SetUserNameAction,
  repositionUser,
  setNextTalkName,
  setUserName,
} from "../actions";
import { TTState, User } from "../types";

import EditableText from "../components/EditableText";
import { compose } from "redux";
import { connect } from "react-redux";
import { getUserById } from "../selectors";

interface Props {
  user: User;
  setUserName(userId: string, name: string): SetUserNameAction;
  setNextTalkName(userId: string, name: string): SetNextTalkNameAction;
}

interface OwnProps {
  userId: string;
  highlight: boolean;
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

function dragSourceCollect(
  connector: DragSourceConnector,
  monitor: DragLayerMonitor
) {
  return {
    connectDragSource: connector.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

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

class UserRow extends React.Component<
  Props & OwnProps & DragSourceProps & DropTargetProps,
  {}
> {
  render() {
    return this.props.connectDropTarget(
      this.props.connectDragSource(
        <tr className={this.props.highlight ? "is-selected" : ""}>
          <td>
            <EditableText
              value={this.props.user.name}
              placeholder="(unknown)"
              setValue={value =>
                this.props.setUserName(this.props.userId, value)}
            />
          </td>
          <td>
            <EditableText
              value={this.props.user.nextTalk}
              placeholder="(untitled)"
              setValue={value =>
                this.props.setNextTalkName(this.props.userId, value)}
            />
          </td>
          <td>Friday</td>
        </tr>
      )
    );
  }
}

const mapStateToProps = (state: TTState, ownProps: OwnProps) => ({
  user: getUserById(state, ownProps.userId),
});

const mapDispatchToProps = {
  setUserName,
  setNextTalkName,
  repositionUser,
};

const Output = compose(
  DropTarget(ItemTypes.USER, dropTarget, dropTargetCollect),
  DragSource(ItemTypes.USER, userSource, dragSourceCollect),
  connect(mapStateToProps, mapDispatchToProps)
)(UserRow);
export default Output;
