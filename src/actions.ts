import { Action } from "redux";

export type JTAction =
  | InitAction
  | InitialLoadStartAction
  | InitialLoadSuccessAction
  | IncrementRequestsInFlightAction
  | DecrementRequestsInFlightAction
  | PreviousDateAction
  | NextDateAction
  | RecordDeliveryAction;

export type Delivery = {
  date: string;
  // Time is a string-encoded int64.
  time: string;
};

export interface InitialLoadData {
  deliveries: Delivery[];
}

export const INIT = "@@INIT";
export const INITIAL_LOAD_START = "INITIAL_LOAD_START";
export const INITIAL_LOAD_SUCCESS = "INITIAL_LOAD_SUCCESS";
export const INCREMENT_REQUESTS_IN_FLIGHT = "INCREMENT_REQUESTS_IN_FLIGHT";
export const DECREMENT_REQUESTS_IN_FLIGHT = "DECREMENT_REQUESTS_IN_FLIGHT";
export const PREVIOUS_DATE = "PREVIOUS_DATE";
export const NEXT_DATE = "NEXT_DATE";
export const RECORD_DELIVERY = "RECORD_DELIVERY";

export interface InitAction extends Action {
  type: "@@INIT";
}

export interface InitialLoadStartAction extends Action {
  type: "INITIAL_LOAD_START";
}

export interface InitialLoadSuccessAction extends Action {
  type: typeof INITIAL_LOAD_SUCCESS;
  deliveries: Delivery[];
}

export interface IncrementRequestsInFlightAction extends Action {
  type: typeof INCREMENT_REQUESTS_IN_FLIGHT;
}

export interface DecrementRequestsInFlightAction extends Action {
  type: typeof DECREMENT_REQUESTS_IN_FLIGHT;
}

export interface PreviousDateAction extends Action {
  type: typeof PREVIOUS_DATE;
}

export interface NextDateAction extends Action {
  type: typeof NEXT_DATE;
}

export interface RecordDeliveryAction extends Action {
  type: typeof RECORD_DELIVERY;
  time: Date;
}

export const init = (): InitAction => ({
  type: INIT,
});

export const initialLoadStart = (): InitialLoadStartAction => ({
  type: INITIAL_LOAD_START,
});

export const initialLoadSuccess = (
  deliveries: Delivery[]
): InitialLoadSuccessAction => ({
  type: INITIAL_LOAD_SUCCESS,
  deliveries,
});

export const incrementRequestsInFlight = (): IncrementRequestsInFlightAction => ({
  type: INCREMENT_REQUESTS_IN_FLIGHT,
});

export const decrementRequestsInFlight = (): DecrementRequestsInFlightAction => ({
  type: DECREMENT_REQUESTS_IN_FLIGHT,
});

export const previousDate = (): PreviousDateAction => ({
  type: PREVIOUS_DATE,
});

export const nextDate = (): NextDateAction => ({
  type: NEXT_DATE,
});

export const recordDelivery = (time: Date): RecordDeliveryAction => ({
  type: RECORD_DELIVERY,
  time,
});
