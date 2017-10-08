import {
  ADD_USER,
  INCREMENT,
  INITIAL_LOAD_START,
  INITIAL_LOAD_SUCCESS,
  REPOSITION_USER,
  RESOLVE_REPOSITION,
  SCHEDULE_NEW_TALK,
  SET_NEXT_TALK_NAME,
  SET_TALK_NAME,
  SET_USER_NAME,
  TOGGLE_TALK,
  TTAction,
  UPDATE_LOCAL_ID,
  UPDATE_USER_TEXT,
} from "./actions";
import {
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
  userState: UserState = { byId: {}, order: [], nextLocalId: -1 },
  action: TTAction
): UserState {
  switch (action.type) {
    case INITIAL_LOAD_SUCCESS:
      return {
        ...userState,
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
        ...userState,
        byId: {
          ...userState.byId,
          [user.id]: user,
        },
        order: [...userState.order, user.id],
        nextLocalId: userState.nextLocalId - 1,
      };
    }
    case UPDATE_LOCAL_ID: {
      if (action.idType != "user") {
        return userState;
      }
      const newById = { ...userState.byId };
      const updatedUser = {
        ...userState.byId[action.localId],
        id: action.remoteId,
      } as User;
      delete newById[action.localId];
      newById[updatedUser.id] = updatedUser;
      const newOrder = userState.order.map(
        id => (id == action.localId ? action.remoteId : id)
      );
      return {
        ...userState,
        byId: newById,
        order: newOrder,
      };
    }
    case SET_USER_NAME: {
      const user = userState.byId[action.userId];
      return {
        ...userState,
        byId: {
          ...userState.byId,
          [user.id]: {
            ...user,
            name: action.name,
          },
        },
      };
    }
    case SET_NEXT_TALK_NAME: {
      const user = userState.byId[action.userId];
      return {
        ...userState,
        byId: {
          ...userState.byId,
          [user.id]: {
            ...user,
            nextTalk: action.name,
          },
        },
      };
    }
    case REPOSITION_USER: {
      return {
        ...userState,
        order: reorder(
          userState.order,
          action.movedUserId,
          action.anchorUserId,
          action.before
        ),
      };
    }
    default:
      return userState;
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

const counterReducer = (state: number = 0, action: TTAction): number => {
  switch (action.type) {
    case INCREMENT:
      return state + 1;
    default:
      return state;
  }
};

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

// The text in the textbox for adding a new user.
const userText = (state: string = "", action: TTAction): string => {
  switch (action.type) {
    case UPDATE_USER_TEXT:
      return action.userText;
    case ADD_USER:
      return "";
    default:
      return state;
  }
};
const viewReducer = combineReducers({
  counter: counterReducer,
  loading: loadingReducer,
  userText,
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
  }
  return state;
};

export const reducer = combineReducers<TTState>({
  entities: combineReducers({
    user: userReducer,
    talk: talkReducer,
  }),
  view: viewReducer,
  requestQueue,
});
