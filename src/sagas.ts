import {
  initialLoadSuccess,
  Delivery,
  INITIAL_LOAD_START,
  RECORD_DELIVERY,
  RecordDeliveryAction,
} from "./actions";
import { ApiFetchAllResponse, ApiServiceApi, ApiDelivery } from "./backend/api";
import { call, put, takeEvery } from "redux-saga/effects";
import { formatDate } from "./utils";

export function* watchInitialLoad(api: ApiServiceApi) {
  yield takeEvery(INITIAL_LOAD_START, performInitialLoad, api);
}

const apiDeliveryToDelivery = (apiDelivery: ApiDelivery): Delivery => {
  const time = {
    hour: 0,
    minute: 0,
    second: 0,
    ...apiDelivery.time,
  };
  return {
    date: apiDelivery.date!,
    time,
  };
};

function* performInitialLoad(api: ApiServiceApi) {
  const data: ApiFetchAllResponse = yield call([api, api.fetchAll]);
  // We do a risky cast here because the types just "happen" to line up, except that the client's
  // fields aren't nullable. We don't expect the server to ever send null fields though.
  // TODO(james): Check for nullables.
  yield put(initialLoadSuccess(data.delivery!.map(apiDeliveryToDelivery)));
}

export function* watchRecordDelivery(api: ApiServiceApi) {
  yield takeEvery(RECORD_DELIVERY, performRecordDelivery, api);
}

function* performRecordDelivery(
  api: ApiServiceApi,
  action: RecordDeliveryAction
) {
  const date = formatDate(action.time);
  yield call([api, api.recordDelivery], {
    delivery: {
      date,
      time: {
        hour: action.time.getHours(),
        minute: action.time.getMinutes(),
        second: action.time.getSeconds(),
      },
    },
  });
}
