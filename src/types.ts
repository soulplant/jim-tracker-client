import { RepositionUserAction, TTAction } from "./actions";

// Types of entities.

export interface User {
  id: string;
  name: string;
  nextTalk: string;
}

export interface Link {
  name: string;
  url: string;
}

export interface Talk {
  id: string;
  speakerId: string;
  name: string;
  links: Link[];
  done: boolean;
}

// Types for parts of the State.
export interface UserState {
  byId: { [id: string]: User };
  order: string[];

  // The next local id that can be used for entities that are not yet created on the server.
  nextLocalId: number;
}

export interface TalkState {
  byId: { [id: string]: Talk };
  order: string[];

  // The next local id that can be used for tasks that are not yet created on the server.
  nextLocalId: number;
}

export interface ConfirmState {
  action: TTAction;
  // TODO(james): Allow callers to specify a message that goes in the popup.
}

export interface ViewState {
  counter: number;
  loading: boolean;
  confirm: ConfirmState | null;
}

export interface EntityState {
  user: UserState;
  talk: TalkState;
}

export type RequestQueueState = {
  pending: RepositionUserAction[];
};

export interface TTState {
  entities: EntityState;
  view: ViewState;
  requestQueue: RequestQueueState;
}
