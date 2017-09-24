// Types of entities.

export interface User {
  id: string;
  name: string;
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
}

export interface TalkState {
  byId: { [id: string]: Talk };
  order: string[];

  // The next local id that can be used for tasks that are not yet created on the server.
  nextLocalId: number;
}

export interface ViewState {
  counter: number;
}

export interface EntityState {
  user: UserState;
  talk: TalkState;
}

export interface TTState {
  entities: EntityState;
  view: ViewState;
}
