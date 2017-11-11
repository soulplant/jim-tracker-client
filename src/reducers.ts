import {
  JTAction,
  INCREMENT_REQUESTS_IN_FLIGHT,
  DECREMENT_REQUESTS_IN_FLIGHT,
} from "./actions";

import { combineReducers } from "redux";
import { JTState } from "./types";

// // Split the entities with an id field into a map of the same type.
// function splitById<T extends { id: string }>(ts: T[]): { [id: string]: T } {
//   const result: { [id: string]: T } = {};
//   ts.forEach(t => {
//     result[t.id] = t;
//   });
//   return result;
// }

// // Retrieves the list of ids from a group of entities.
// function getIds<T extends { id: string }>(ts: T[]): string[] {
//   return ts.map(t => t.id);
// }

const requestsInFlightReducer = (
  state: number = 0,
  action: JTAction
): number => {
  switch (action.type) {
    case INCREMENT_REQUESTS_IN_FLIGHT: {
      return state + 1;
    }
    case DECREMENT_REQUESTS_IN_FLIGHT: {
      return state - 1;
    }
    default:
      return state;
  }
};

export const reducer = combineReducers<JTState>({
  requestsInFlight: requestsInFlightReducer,
});
