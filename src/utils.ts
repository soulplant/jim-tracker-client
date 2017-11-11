import * as moment from "moment";
import { LocalTime } from "./types";

// Formats the given date in YYYYMMDD.
export const formatDate = (date: Date): string => {
  return moment(date).format("YYYYMMDD");
};

export const formatTime = (date: Date, time: LocalTime): string => {
  return moment(date)
    .set("h", time.hour)
    .set("m", time.minute)
    .set("s", time.second)
    .format("h:mm A");
};
