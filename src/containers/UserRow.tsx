import * as React from "react";

import {
  ConnectDropTarget,
  DragLayerMonitor,
  DragSource,
  DragSourceConnector,
  DragSourceSpec,
  DropTarget,
  DropTargetConnector,
  DropTargetMonitor,
  DropTargetSpec,
} from "react-dnd";
import { StyleSheet, css } from "aphrodite";
import { TTState, User } from "../types";
import { getIsEditMode, getUserById } from "../selectors";
import {
  removeUserFromRotation,
  repositionUser,
  setNextTalkName,
  setUserName,
} from "../actions";

import EditableText from "../components/EditableText";
import { compose } from "redux";
import { connect } from "react-redux";
import { getEmptyImage } from "react-dnd-html5-backend";

interface Props {
  user: User;
  isEditMode: boolean;
}

interface DispatchProps {
  setUserName: typeof setUserName;
  setNextTalkName: typeof setNextTalkName;
  removeUserFromRotation: typeof removeUserFromRotation;
}

interface OwnProps {
  userId: string;
  highlight: boolean;
}

interface DragSourceProps {
  connectDragSource: Function;
  connectDragPreview: Function;
  isDragging: boolean;
  isEditMode: boolean;
}

interface DropTargetProps {
  connectDropTarget: ConnectDropTarget;
  isOver: boolean;
  canDrop: boolean;
  isBefore: boolean;
}

export const ItemTypes: { [id: string]: string } = {
  USER: "user",
};

export type UserDragItem = {
  type: typeof ItemTypes.USER;
  userId: string;
};

// Note, we just clag on the isEditMode here because it is injected by the outer
// connect below. We don't bother defining an interface just for it.
const userSource: DragSourceSpec<OwnProps & { isEditMode: boolean }> = {
  beginDrag(props: OwnProps): UserDragItem {
    return { type: ItemTypes.USER, userId: props.userId };
  },
  canDrag(props: OwnProps & { isEditMode: boolean }): boolean {
    return props.isEditMode;
  },
};

function dragSourceCollect(
  connector: DragSourceConnector,
  monitor: DragLayerMonitor
) {
  return {
    connectDragSource: connector.dragSource(),
    connectDragPreview: connector.dragPreview(),
    isDragging: monitor.isDragging(),
  };
}

type DropTargetOwnProps = OwnProps & { repositionUser: typeof repositionUser };

const dropTarget: DropTargetSpec<DropTargetOwnProps> = {
  canDrop(props: DropTargetOwnProps, monitor: DropTargetMonitor) {
    const userId = (monitor.getItem() as UserDragItem).userId;
    return userId !== props.userId;
  },
  drop(props: DropTargetOwnProps, monitor: DropTargetMonitor) {
    const dy = monitor.getDifferenceFromInitialOffset().y;
    const before = dy < 0;
    const item = monitor.getItem() as UserDragItem;
    props.repositionUser(item.userId, props.userId, before);
  },
  hover(props: DropTargetOwnProps, monitor: DropTargetMonitor) {
    // TODO(james): Reorder the elements optimstically as they are dragged
    // around here.
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
  isDragging: {
    opacity: 0,
    height: 0,
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

  componentDidMount() {
    this.props.connectDragPreview(getEmptyImage(), {
      captureDraggingState: true,
    });
  }

  render() {
    return this.props.connectDropTarget(
      this.props.connectDragSource(
        <tr
          className={
            (this.props.highlight && !this.props.isEditMode
              ? "is-selected"
              : "") +
            " " +
            css(
              this.props.isEditMode && styles.editMode,
              this.props.isDragging && styles.isDragging
            )
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
  // We connect here to pass props needed by the drag logic, otherwise we'd have
  // to provide it as an OwnProp to the UserRow.
  connect(
    (state: TTState, ownProps: OwnProps) => ({
      isEditMode: getIsEditMode(state),
    }),
    { repositionUser }
  ),
  DropTarget(ItemTypes.USER, dropTarget, dropTargetCollect),
  DragSource(ItemTypes.USER, userSource, dragSourceCollect),
  connect(mapStateToProps, mapDispatchToProps)
)(UserRow);
export default Output;
