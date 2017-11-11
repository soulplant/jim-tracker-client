import { JTState } from "./types";

export const getIsLoading = (state: JTState): boolean => {
  return state.requestsInFlight > 0;
};
