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
  RemoveUserFromRotationAction,
  RepositionUserAction,
  SetNextTalkNameAction,
  SetUserNameAction,
  removeUserFromRotation,
  repositionUser,
  setNextTalkName,
  setUserName,
} from "../actions";
import { StyleSheet, css } from "aphrodite";
import { TTState, User } from "../types";
import { getIsEditMode, getUserById } from "../selectors";

import EditableText from "../components/EditableText";
import { compose } from "redux";
import { connect } from "react-redux";

interface Props {
  user: User;
  isEditMode: boolean;
}

interface DispatchProps {
  setUserName(userId: string, name: string): SetUserNameAction;
  setNextTalkName(userId: string, name: string): SetNextTalkNameAction;
  removeUserFromRotation(userId: string): RemoveUserFromRotationAction;
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

const styles = StyleSheet.create({
  editMode: {
    cursor: "grab",
  },
  dateColumn: {
    width: "8em",
  },
});

class UserRow extends React.Component<
  Props & DispatchProps & OwnProps & DragSourceProps & DropTargetProps,
  {}
> {
  removeUser = (e: React.SyntheticEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    this.props.removeUserFromRotation(this.props.user.id);
  };

  render() {
    return this.props.connectDropTarget(
      this.props.connectDragSource(
        <tr
          className={
            (this.props.highlight && !this.props.isEditMode
              ? "is-selected"
              : "") +
            " " +
            css(this.props.isEditMode && styles.editMode)
          }
        >
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
          <td className={css(styles.dateColumn)}>
            {this.props.isEditMode ? (
              <a
                href="#"
                onClick={this.removeUser}
                style={{ color: "#ff3860", textDecoration: "underline" }}
              >
                Delete
              </a>
            ) : (
              "Friday"
            )}
          </td>
        </tr>
      )
    );
  }
}

const mapStateToProps = (state: TTState, ownProps: OwnProps): Props => ({
  user: getUserById(state, ownProps.userId),
  isEditMode: getIsEditMode(state),
});

const mapDispatchToProps = {
  setUserName,
  setNextTalkName,
  repositionUser,
  removeUserFromRotation,
};

const Output = compose(
  DropTarget(ItemTypes.USER, dropTarget, dropTargetCollect),
  DragSource(ItemTypes.USER, userSource, dragSourceCollect),
  connect(mapStateToProps, mapDispatchToProps)
)(UserRow);
export default Output;
