import { initialLoadSuccess, Delivery, INITIAL_LOAD_START } from "./actions";
import { ApiFetchAllResponse, ApiServiceApi } from "./backend/api";
import { call, put, takeEvery } from "redux-saga/effects";

export function* watchInitialLoad(api: ApiServiceApi) {
  yield takeEvery(INITIAL_LOAD_START, performInitialLoad, api);
}

function* performInitialLoad(api: ApiServiceApi) {
  const data: ApiFetchAllResponse = yield call([api, api.fetchAll]);
  // We do a risky cast here because the types just "happen" to line up, except that the client's
  // fields aren't nullable. We don't expect the server to ever send null fields though.
  // TODO(james): Check for nullables.
  yield put(initialLoadSuccess(data.delivery as Delivery[]));
}
