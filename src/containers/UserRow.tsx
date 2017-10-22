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
import {
  confirmationRequested,
  removeUserFromRotation,
  repositionUser,
  updateUser,
} from "../actions";
import { getIsEditMode, getUserById, getIsUserLoading } from "../selectors";

import EditableText from "../components/EditableText";
import { compose } from "redux";
import { connect } from "react-redux";
import { getEmptyImage } from "react-dnd-html5-backend";

interface Props {
  user: User;

  isEditMode: boolean;

  // Whether or not this user is being confirmed on the server right now.
  // TODO(james): We only need this to prevent interactions so that when we
  // update the local id in the client we don't lose our intermediate state. We
  // should figure out a way of handling local ids that doesn't cause react to
  // unmount / remount us.
  isLoading: boolean;
}

interface DispatchProps {
  updateUser: typeof updateUser;
  confirmationRequested: typeof confirmationRequested;
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
  },
  tr: {
    height: "3.5em",
  },
  td: {
    verticalAlign: "middle",
  },
});

class UserRow extends React.Component<
  Props & DispatchProps & OwnProps & DragSourceProps & DropTargetProps,
  {}
> {
  removeUser = (e: React.SyntheticEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    this.props.confirmationRequested(
      removeUserFromRotation(this.props.user.id),
      "",
      "Remove " + (this.props.user.name || "(unknown)") + "?"
    );
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
              styles.tr,
              this.props.isEditMode && styles.editMode,
              this.props.isDragging && styles.isDragging
            )
          }
        >
          <td className={css(styles.td)}>
            <EditableText
              value={this.props.user.name}
              placeholder="(unknown)"
              disabled={this.props.isLoading}
              setValue={value =>
                this.props.updateUser(this.props.userId, { name: value })}
            />
          </td>
          <td className={css(styles.td)}>
            <EditableText
              value={this.props.user.nextTalk}
              placeholder="(untitled)"
              disabled={this.props.isLoading}
              setValue={value =>
                this.props.updateUser(this.props.userId, { nextTalk: value })}
            />
          </td>
          <td className={css(styles.td, styles.dateColumn)}>
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
  isLoading: getIsUserLoading(state, ownProps.userId),
});

const mapDispatchToProps = {
  updateUser,
  repositionUser,
  confirmationRequested,
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
