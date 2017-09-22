import { Action } from 'redux';
import { User, Talk } from '../types';

export type TTAction = InitialLoadAction;

interface InitialLoadData {
  user: User[];
  talk: Talk[];
}

export const INITIAL_LOAD = 'INITIAL_LOAD';

interface InitialLoadAction extends Action {
  type: 'INITIAL_LOAD';
  data: InitialLoadData;
}

export const initialLoad = (data: InitialLoadData): InitialLoadAction => {
  return {
    type: INITIAL_LOAD,
    data,
  };
};