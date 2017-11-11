import { Delivery } from "./actions";

// Types of entities.

export type LocalTime = {
  hour: number;
  minute: number;
  second: number;
};

export type JTState = {
  deliveries: { [date: string]: Delivery | null };
  date: Date;
  requestsInFlight: number;
};
