import { combineReducers } from 'redux';
import { State, TalkState, UserState } from '../types';
import { INITIAL_LOAD, TTAction } from './actions';

// Split the entities with an id field into a map of the same type.
function splitById<T extends {id: string}>(ts: T[]): {[id: string]: T} {
  const result: {[id: string]: T} = {};
  ts.forEach(t => {
    result[t.id] = t;
  });
  return result;
}

// Retrieves the list of ids from a group of entities.
function getIds<T extends {id: string}>(ts: T[]): string[] {
  return ts.map(t => t.id);
}

function userReducer(userState: UserState = {byId: {}, order: []}, action: TTAction): UserState {
  switch (action.type) {
    case INITIAL_LOAD:
      return {
        ...userState,
        byId: splitById(action.data.user),
        order: getIds(action.data.user),
      };
    default:
      return userState;
  }
}

function talkReducer(talkState: TalkState = {byId: {}, order: []}, action: TTAction): TalkState {
  switch (action.type) {
    case INITIAL_LOAD:
      return {
        ...talkState,
        byId: splitById(action.data.talk),
        order: getIds(action.data.talk),
      };
    default:
      return talkState;
  }
}

function viewReducer(view: {} = {}): {} {
  return view;
}

export const reducer = combineReducers<State>({
  entities: combineReducers({
    user: userReducer,
    talk: talkReducer,
  }),
  view: viewReducer,
});