import { State, User, Talk } from "../types";

// Get all the users we know about in their natural order.
export const getAllUsers = (state: State): User[] => {
  const user = state.entities.user;
  return user.order.map(id => user.byId[id]);
}

// Get all the talks we know about in their natural order.
export const getAllTalks = (state: State): Talk[] => {
  const talk = state.entities.talk;
  return talk.order.map(id => talk.byId[id]);
}

// Get the speaker of a given talk.
export const getSpeaker = (state: State, talkId: string): User => {
  const speakerId = state.entities.talk.byId[talkId].speakerId;
  return state.entities.user.byId[speakerId];
}
