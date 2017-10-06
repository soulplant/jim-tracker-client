import { combineReducers } from "redux";
import { TTState, TalkState, UserState, Talk, User } from "./types";
import {
  INITIAL_LOAD_SUCCESS,
  TTAction,
  INCREMENT,
  TOGGLE_TALK,
  SET_TALK_NAME,
  SCHEDULE_NEW_TALK,
  INITIAL_LOAD_START,
  UPDATE_USER_TEXT,
  ADD_USER,
  SET_NEXT_TALK_NAME,
} from "./actions";

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
        id: userState.nextLocalId + "",
        name: action.userName,
        nextTalk: "(untitled)",
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
    case SET_NEXT_TALK_NAME: {
      const user = userState.byId[action.userId];
      return {
        ...userState,
        byId: {
          ...userState.byId,
          [user.id]: {
            ...user,
            nextTalk: action.name || "(untitled)",
          },
        },
      };
    }
    default:
      return userState;
  }
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
  userText: userText,
});

export const reducer = combineReducers<TTState>({
  entities: combineReducers({
    user: userReducer,
    talk: talkReducer,
  }),
  view: viewReducer,
});
