import {
  ADD_USER,
  CONFIRMATION_RECEIVED,
  CONFIRMATION_REJECTED,
  CONFIRMATION_REQUESTED,
  END_EDIT_MODE,
  ESCAPE_PRESSED,
  INITIAL_LOAD_START,
  INITIAL_LOAD_SUCCESS,
  REMOVE_USER_FROM_ROTATION,
  REPOSITION_USER,
  RESOLVE_REPOSITION,
  SCHEDULE_NEW_TALK,
  SET_TALK_NAME,
  START_EDIT_MODE,
  TOGGLE_TALK,
  TTAction,
  UPDATE_LOCAL_ID,
  UPDATE_USER,
  INCREMENT_REQUESTS_IN_FLIGHT,
  DECREMENT_REQUESTS_IN_FLIGHT,
} from "./actions";
import {
  ConfirmState,
  RequestQueueState,
  TTState,
  Talk,
  TalkState,
  User,
  UserState,
} from "./types";

import { combineReducers } from "redux";

// Split the entities with an id field into a map of the same type.
function splitById<T extends { id: string }>(ts: T[]): { [id: string]: T } {
  const result: { [id: string]: T } = {};
  ts.forEach(t => {
    result[t.id] = t;
  });
  return result;
}

// Retrieves the list of ids from a group of entities.
function getIds<T extends { id: string }>(ts: T[]): string[] {
  return ts.map(t => t.id);
}

export function userReducer(
  state: UserState = { byId: {}, order: [], nextLocalId: -1 },
  action: TTAction
): UserState {
  switch (action.type) {
    case INITIAL_LOAD_SUCCESS:
      return {
        ...state,
        byId: splitById(action.data.user),
        order: getIds(action.data.user),
      };
    case ADD_USER: {
      const user: User = {
        id: action.localId,
        name: action.userName,
        nextTalk: "",
      };
      return {
        ...state,
        byId: {
          ...state.byId,
          [user.id]: user,
        },
        order: [...state.order, user.id],
        nextLocalId: state.nextLocalId - 1,
      };
    }
    case UPDATE_LOCAL_ID: {
      if (action.idType !== "user") {
        return state;
      }
      const newById = { ...state.byId };
      const updatedUser = {
        ...state.byId[action.localId],
        id: action.remoteId,
      } as User;
      delete newById[action.localId];
      newById[updatedUser.id] = updatedUser;
      const newOrder = state.order.map(
        id => (id === action.localId ? action.remoteId : id)
      );
      return {
        ...state,
        byId: newById,
        order: newOrder,
      };
    }
    case UPDATE_USER: {
      const user = state.byId[action.userId];
      return {
        ...state,
        byId: {
          ...state.byId,
          [user.id]: {
            ...user,
            ...action.updates,
          },
        },
      };
    }
    case REPOSITION_USER: {
      return {
        ...state,
        order: reorder(
          state.order,
          action.movedUserId,
          action.anchorUserId,
          action.before
        ),
      };
    }
    case REMOVE_USER_FROM_ROTATION: {
      const { [action.userId]: removed, ...byId } = state.byId;
      return {
        ...state,
        byId,
        order: state.order.filter(id => action.userId !== id),
      };
    }
    default:
      return state;
  }
}

// Reorders the given list of ids by moving `moved` to either before or after `anchor`.
function reorder(
  ids: string[],
  moved: string,
  anchor: string,
  before: boolean
): string[] {
  const result = [...ids];
  const movedIdx = ids.indexOf(moved);
  const anchorIdx = ids.indexOf(anchor);
  const insertIdx = anchorIdx + (before ? 0 : 1);
  const deleteIdx = movedIdx + (movedIdx < insertIdx ? 0 : 1);
  result.splice(insertIdx, 0, moved);
  result.splice(deleteIdx, 1);
  return result;
}

function updateTalk(talkState: TalkState, talk: Talk): TalkState {
  return {
    ...talkState,
    byId: {
      ...talkState.byId,
      [talk.id]: talk,
    },
  };
}

function talkReducer(
  talkState: TalkState = { byId: {}, order: [], nextLocalId: -1 },
  action: TTAction
): TalkState {
  switch (action.type) {
    case INITIAL_LOAD_SUCCESS:
      return {
        ...talkState,
        byId: splitById(action.data.talk),
        order: getIds(action.data.talk),
      };
    case TOGGLE_TALK: {
      const talk = talkState.byId[action.talkId];
      const newTalk = { ...talk, done: !talk.done };
      return updateTalk(talkState, newTalk);
    }
    case SET_TALK_NAME: {
      const talk = talkState.byId[action.talkId];
      const newTalk = { ...talk, name: action.name };
      return updateTalk(talkState, newTalk);
    }
    case SCHEDULE_NEW_TALK: {
      const talk: Talk = {
        id: talkState.nextLocalId + "",
        done: false,
        links: [],
        name: "(untitled)",
        speakerId: action.userId,
      };
      return {
        ...talkState,
        byId: {
          ...talkState.byId,
          [talk.id]: talk,
        },
        order: [...talkState.order, talk.id],
        nextLocalId: talkState.nextLocalId - 1,
      };
    }
    default:
      return talkState;
  }
}

const loadingReducer = (state: boolean = false, action: TTAction): boolean => {
  switch (action.type) {
    case INITIAL_LOAD_START:
      return true;
    case INITIAL_LOAD_SUCCESS:
      return false;
    default:
      return state;
  }
};

const confirmReducer = (
  state: ConfirmState | null = null,
  action: TTAction
): ConfirmState | null => {
  switch (action.type) {
    case CONFIRMATION_REQUESTED: {
      return { ...state, ...action };
    }
    case ESCAPE_PRESSED:
    case CONFIRMATION_RECEIVED:
    case CONFIRMATION_REJECTED:
      return null;
    default:
      return state;
  }
};

const editModeReducer = (state: boolean = false, action: TTAction): boolean => {
  switch (action.type) {
    case START_EDIT_MODE: {
      return true;
    }
    case ESCAPE_PRESSED:
    case END_EDIT_MODE: {
      return false;
    }
    default:
      return state;
  }
};

const requestsInFlightReducer = (
  state: number = 0,
  action: TTAction
): number => {
  switch (action.type) {
    case INCREMENT_REQUESTS_IN_FLIGHT: {
      return state + 1;
    }
    case DECREMENT_REQUESTS_IN_FLIGHT: {
      return state - 1;
    }
    default:
      return state;
  }
};

const viewReducer = combineReducers({
  loading: loadingReducer,
  requestsInFlight: requestsInFlightReducer,
  editMode: editModeReducer,
  confirm: confirmReducer,
});

const requestQueue = (
  state: RequestQueueState = { pending: [] },
  action: TTAction
): RequestQueueState => {
  switch (action.type) {
    case REPOSITION_USER: {
      return {
        pending: [...state.pending, action],
      };
    }
    case RESOLVE_REPOSITION: {
      return {
        pending: state.pending.slice(1),
      };
    }
    default:
      return state;
  }
};

export const reducer = combineReducers<TTState>({
  entities: combineReducers({
    user: userReducer,
    talk: talkReducer,
  }),
  view: viewReducer,
  requestQueue,
});
