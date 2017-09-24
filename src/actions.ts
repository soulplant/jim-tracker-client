import { Action } from 'redux';
import { User, Talk } from './types';

export type TTAction =
  | InitialLoadAction
  | IncrementAction
  | ToggleTalkAction
  | SetTalkNameAction;

interface InitialLoadData {
  user: User[];
  talk: Talk[];
}

export const INITIAL_LOAD = 'INITIAL_LOAD';
export const INCREMENT = 'INCREMENT';
export const TOGGLE_TALK = 'TOGGLE_TALK';
export const SET_TALK_NAME = 'SET_TALK_NAME';

export interface InitialLoadAction extends Action {
  type: 'INITIAL_LOAD';
  data: InitialLoadData;
}

export interface IncrementAction extends Action {
  type: 'INCREMENT';
}

export interface ToggleTalkAction extends Action {
  type: 'TOGGLE_TALK';
  talkId: string;
}

export interface SetTalkNameAction extends Action {
  type: 'SET_TALK_NAME';
  talkId: string;
  name: string;
}

export const initialLoad = (data: InitialLoadData): InitialLoadAction => ({
  type: INITIAL_LOAD,
  data
});

export const increment = (): IncrementAction => ({
  type: INCREMENT
});

// Toggles the done status of a talk.
export const toggleTalk = (talkId: string): ToggleTalkAction => ({
  type: TOGGLE_TALK,
  talkId
});

// Sets the name of a talk.
export const setTalkName = (
  talkId: string,
  name: string
): SetTalkNameAction => ({
  type: SET_TALK_NAME,
  talkId,
  name
});
