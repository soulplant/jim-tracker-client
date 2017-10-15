import { Talk, User } from "./types";

import { Action } from "redux";

export type TTAction =
  | InitAction
  | InitialLoadStartAction
  | InitialLoadSuccessAction
  | IncrementAction
  | ToggleTalkAction
  | SetTalkNameAction
  | SetUserNameAction
  | SetNextTalkNameAction
  | ScheduleNewTalkAction
  | AddUserAction
  | RepositionUserAction
  | ResolveRepositionAction
  | CompleteTalkAction
  | ConfirmationRequestedAction
  | ConfirmationReceivedAction
  | ConfirmationRejectedAction
  | StartEditModeAction
  | EndEditModeAction
  | RemoveUserFromRotationAction
  | UpdateLocalIdAction;

export interface InitialLoadData {
  user: User[];
  talk: Talk[];
}

export const INIT = "@@INIT";
export const INITIAL_LOAD_START = "INITIAL_LOAD_START";
export const INITIAL_LOAD_SUCCESS = "INITIAL_LOAD_SUCCESS";
export const INCREMENT = "INCREMENT";
export const TOGGLE_TALK = "TOGGLE_TALK";
export const SET_TALK_NAME = "SET_TALK_NAME";
export const SET_NEXT_TALK_NAME = "SET_NEXT_TALK_NAME";
export const SET_USER_NAME = "SET_USER_NAME";
export const SCHEDULE_NEW_TALK = "SCHEDULE_NEW_TALK";
export const ADD_USER = "ADD_USER";
export const UPDATE_USER_TEXT = "UPDATE_USER_TEXT";
export const REPOSITION_USER = "REPOSITION_USER";
export const RESOLVE_REPOSITION = "RESOLVE_REPOSITION";
export const UPDATE_LOCAL_ID = "UPDATE_LOCAL_ID";
export const COMPLETE_TALK = "COMPLETE_TALK";
export const CONFIRMATION_REQUESTED = "CONFIRMATION_REQUESTED";
export const CONFIRMATION_RECEIVED = "CONFIRMATION_RECEIVED";
export const CONFIRMATION_REJECTED = "CONFIRMATION_REJECTED";
export const START_EDIT_MODE = "START_EDIT_MODE";
export const END_EDIT_MODE = "END_EDIT_MODE";
export const REMOVE_USER_FROM_ROTATION = "REMOVE_USER_FROM_ROTATION";

export interface InitAction extends Action {
  type: "@@INIT";
}

export interface InitialLoadStartAction extends Action {
  type: "INITIAL_LOAD_START";
}

export interface InitialLoadSuccessAction extends Action {
  type: typeof INITIAL_LOAD_SUCCESS;
  data: InitialLoadData;
}

export interface IncrementAction extends Action {
  type: typeof INCREMENT;
}

export interface ToggleTalkAction extends Action {
  type: typeof TOGGLE_TALK;
  talkId: string;
}

export interface SetTalkNameAction extends Action {
  type: typeof SET_TALK_NAME;
  talkId: string;
  name: string;
}

export interface SetUserNameAction extends Action {
  type: typeof SET_USER_NAME;
  userId: string;
  name: string;
}

export interface SetNextTalkNameAction extends Action {
  type: typeof SET_NEXT_TALK_NAME;
  userId: string;
  name: string;
}

export interface ScheduleNewTalkAction extends Action {
  type: typeof SCHEDULE_NEW_TALK;
  userId: string;
}

export interface AddUserAction extends Action {
  type: typeof ADD_USER;
  localId: string;
  userName: string;
}

export interface RepositionUserAction extends Action {
  type: typeof REPOSITION_USER;
  movedUserId: string;
  anchorUserId: string;
  // Whether movedUserId should be placed before or after anchorUserId.
  before: boolean;
}

export interface ResolveRepositionAction extends Action {
  type: typeof RESOLVE_REPOSITION;
}

export interface UpdateLocalIdAction extends Action {
  type: typeof UPDATE_LOCAL_ID;
  idType: "user";
  localId: string;
  remoteId: string;
}

export interface CompleteTalkAction extends Action {
  type: typeof COMPLETE_TALK;
  userId: string;
}

export interface ConfirmationRequestedAction extends Action {
  type: typeof CONFIRMATION_REQUESTED;
  action: Action;
}

export interface ConfirmationReceivedAction extends Action {
  type: typeof CONFIRMATION_RECEIVED;
  action: TTAction;
}

export interface ConfirmationRejectedAction extends Action {
  type: typeof CONFIRMATION_REJECTED;
}

export interface StartEditModeAction extends Action {
  type: typeof START_EDIT_MODE;
}

export interface EndEditModeAction extends Action {
  type: typeof END_EDIT_MODE;
}

export interface RemoveUserFromRotationAction extends Action {
  type: typeof REMOVE_USER_FROM_ROTATION;
  userId: string;
}

export const init = (): InitAction => ({
  type: INIT,
});

export const initialLoadStart = (): InitialLoadStartAction => ({
  type: INITIAL_LOAD_START,
});

export const initialLoadSuccess = (
  data: InitialLoadData
): InitialLoadSuccessAction => ({
  type: INITIAL_LOAD_SUCCESS,
  data,
});

export const increment = (): IncrementAction => ({
  type: INCREMENT,
});

// Toggles the done status of a talk.
export const toggleTalk = (talkId: string): ToggleTalkAction => ({
  type: TOGGLE_TALK,
  talkId,
});

// Toggles the done status of a talk.
export const scheduleNewTalk = (userId: string): ScheduleNewTalkAction => ({
  type: SCHEDULE_NEW_TALK,
  userId,
});

// Sets the name of a talk.
export const setTalkName = (
  talkId: string,
  name: string
): SetTalkNameAction => ({
  type: SET_TALK_NAME,
  talkId,
  name,
});

// Sets the name of the next talk someone is doing.
export const setNextTalkName = (
  userId: string,
  name: string
): SetNextTalkNameAction => ({
  type: SET_NEXT_TALK_NAME,
  userId,
  name,
});

// Sets a user's name.
export const setUserName = (
  userId: string,
  name: string
): SetUserNameAction => ({
  type: SET_USER_NAME,
  userId,
  name,
});

// Adds a new user to the list.
export const addUser = (localId: string, userName: string): AddUserAction => ({
  type: ADD_USER,
  localId,
  userName,
});

// Adds a new user to the list.
export const repositionUser = (
  movedUserId: string,
  anchorUserId: string,
  before: boolean
): RepositionUserAction => ({
  type: REPOSITION_USER,
  movedUserId,
  anchorUserId,
  before,
});

// Indicates that the earliest pending reposition is finished.
export const resolveReposition = (): ResolveRepositionAction => ({
  type: RESOLVE_REPOSITION,
});

// Replaces a local id with one from the server.
export const updateLocalId = (
  idType: "user",
  localId: string,
  remoteId: string
): UpdateLocalIdAction => ({
  type: UPDATE_LOCAL_ID,
  idType,
  localId,
  remoteId,
});

export const completeTalk = (userId: string): CompleteTalkAction => ({
  type: COMPLETE_TALK,
  userId,
});

export const confirmationRequested = (
  action: Action
): ConfirmationRequestedAction => ({
  type: CONFIRMATION_REQUESTED,
  action,
});

export const confirmationReceived = (
  action: TTAction
): ConfirmationReceivedAction => ({
  type: CONFIRMATION_RECEIVED,
  action,
});

export const confirmationRejected = (): ConfirmationRejectedAction => ({
  type: CONFIRMATION_REJECTED,
});

export const startEditMode = (): StartEditModeAction => ({
  type: START_EDIT_MODE,
});

export const endEditMode = (): EndEditModeAction => ({
  type: END_EDIT_MODE,
});

export const removeUserFromRotation = (
  userId: string
): RemoveUserFromRotationAction => ({
  type: REMOVE_USER_FROM_ROTATION,
  userId,
});
