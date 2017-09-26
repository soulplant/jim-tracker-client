import { Action } from 'redux';
import { User, Talk } from './types';

export type TTAction =
  | InitialLoadStartAction
  | InitialLoadSuccessAction
  | IncrementAction
  | ToggleTalkAction
  | SetTalkNameAction
  | ScheduleNewTalkAction;

interface InitialLoadData {
  user: User[];
  talk: Talk[];
}

export const INITIAL_LOAD_START = 'INITIAL_LOAD_START';
export const INITIAL_LOAD_SUCCESS = 'INITIAL_LOAD_SUCCESS';
export const INCREMENT = 'INCREMENT';
export const TOGGLE_TALK = 'TOGGLE_TALK';
export const SET_TALK_NAME = 'SET_TALK_NAME';
export const SCHEDULE_NEW_TALK = 'SCHEDULE_NEW_TALK';

export interface InitialLoadStartAction extends Action {
  type: 'INITIAL_LOAD_START';
}

export interface InitialLoadSuccessAction extends Action {
  type: 'INITIAL_LOAD_SUCCESS';
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

export interface ScheduleNewTalkAction extends Action {
  type: 'SCHEDULE_NEW_TALK';
  userId: string;
}

export const initialLoadStart = (): InitialLoadStartAction => ({
  type: INITIAL_LOAD_START,
});

export const initialLoadSuccess = (data: InitialLoadData): InitialLoadSuccessAction => ({
  type: INITIAL_LOAD_SUCCESS,
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

// Toggles the done status of a talk.
export const scheduleNewTalk = (userId: string): ScheduleNewTalkAction => ({
  type: SCHEDULE_NEW_TALK,
  userId
});

// Sets the name of a talk.
export const setTalkName = (talkId: string, name: string): SetTalkNameAction => ({
  type: SET_TALK_NAME,
  talkId,
  name
});
