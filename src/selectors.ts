import { TTState, User, Talk } from './types';

// Get all the users we know about in their natural order.
export const getAllUsers = (state: TTState): User[] => {
  const user = state.entities.user;
  return user.order.map(id => user.byId[id]);
};

// Gets a map of users by id.
export const getUsersById = (state: TTState): {[id: string]: User} => {
  return state.entities.user.byId;
};

// Get all the talks we know about in their natural order.
export const getAllTalks = (state: TTState): Talk[] => {
  const talk = state.entities.talk;
  return talk.order.map(id => talk.byId[id]);
};

// Get a talk by its id.
// TODO(james): Make a generic version like getById(state, "talk", talkId): Talk.
export const getTalkById = (state: TTState, talkId: string): Talk => {
  return state.entities.talk.byId[talkId];
};

// Get a user by its id.
export const getUserById = (state: TTState, userId: string): User => {
  return state.entities.user.byId[userId];
};

// Get the ids of all talks.
export const getAllTalkIds = (state: TTState): string[] => {
  return state.entities.talk.order;
};

// Get the speaker of a given talk.
export const getSpeaker = (state: TTState, talkId: string): User => {
  const speakerId = state.entities.talk.byId[talkId].speakerId;
  return state.entities.user.byId[speakerId];
};

export const getCounter = (state: TTState): number => {
  return state.view.counter;
};