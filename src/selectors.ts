import { JTState, LocalTime } from "./types";
import { formatDate } from "./utils";

export const getIsLoading = (state: JTState): boolean => {
  return state.requestsInFlight > 0;
};

export const getDate = (state: JTState): Date => {
  return state.date;
};

export const getTime = (state: JTState): LocalTime | null => {
  const dateKey = formatDate(getDate(state));
  const date = state.deliveries[dateKey];
  if (!date) {
    return null;
  }
  return date.time;
};

export const getIsToday = (state: JTState): boolean => {
  return formatDate(getDate(state)) == formatDate(getToday(state));
};

export const getToday = (state: JTState): Date => {
  // TODO(james): Store the current date in the store and periodically update
  // it.
  return new Date();
};

export const getIsInitialLoadPending = (state: JTState): boolean => {
  return state.isInitialLoadPending;
};
