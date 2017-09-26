import { combineReducers } from 'redux';
import { TTState, TalkState, UserState, Talk } from './types';
import {
  INITIAL_LOAD_SUCCESS,
  TTAction,
  INCREMENT,
  TOGGLE_TALK,
  SET_TALK_NAME,
  SCHEDULE_NEW_TALK,
  INITIAL_LOAD_START
} from './actions';

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

function userReducer(
  userState: UserState = { byId: {}, order: [] },
  action: TTAction
): UserState {
  switch (action.type) {
    case INITIAL_LOAD_SUCCESS:
      return {
        ...userState,
        byId: splitById(action.data.user),
        order: getIds(action.data.user)
      };
    default:
      return userState;
  }
}

function updateTalk(talkState: TalkState, talk: Talk): TalkState {
  return {
    ...talkState,
    byId: {
      ...talkState.byId,
      [talk.id]: talk
    }
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
        order: getIds(action.data.talk)
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
        id: talkState.nextLocalId + '',
        done: false,
        links: [],
        name: '(untitled)',
        speakerId: action.userId
      };
      return {
        ...talkState,
        byId: {
          ...talkState.byId,
          [talk.id]: talk
        },
        order: [...talkState.order, talk.id],
        nextLocalId: talkState.nextLocalId - 1
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

const viewReducer = combineReducers({
  counter: counterReducer,
  loading: loadingReducer
});

export const reducer = combineReducers<TTState>({
  entities: combineReducers({
    user: userReducer,
    talk: talkReducer
  }),
  view: viewReducer
});
