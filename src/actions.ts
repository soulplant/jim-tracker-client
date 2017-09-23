import { Action } from 'redux';
import { User, Talk } from '../types';

export type TTAction =
  | InitialLoadAction
  | IncrementAction
  ;

interface InitialLoadData {
  user: User[];
  talk: Talk[];
}

export const INITIAL_LOAD = 'INITIAL_LOAD';
export const INCREMENT = 'INCREMENT';

export interface InitialLoadAction extends Action {
  type: 'INITIAL_LOAD';
  data: InitialLoadData;
}

export interface IncrementAction extends Action {
  type: 'INCREMENT';
}

export const initialLoad = (data: InitialLoadData): InitialLoadAction => {
  return {
    type: INITIAL_LOAD,
    data,
  };
};

export const increment = (): IncrementAction => {
  return {
    type: INCREMENT,
  };
};