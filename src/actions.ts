import { Action } from 'redux';
import { User, Talk } from '../types';

export type TTAction =
  | InitialLoadAction
  | IncrementAction
  | ToggleTalkAction
  ;

interface InitialLoadData {
  user: User[];
  talk: Talk[];
}

export const INITIAL_LOAD = 'INITIAL_LOAD';
export const INCREMENT = 'INCREMENT';
export const TOGGLE_TALK = 'TOGGLE_TALK';

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

export const initialLoad = (data: InitialLoadData): InitialLoadAction => ({
  type: INITIAL_LOAD,
  data,
});

export const increment = (): IncrementAction => ({
  type: INCREMENT,
});

export const toggleTalk = (talkId: string): ToggleTalkAction => ({
  type: TOGGLE_TALK,
  talkId,
});