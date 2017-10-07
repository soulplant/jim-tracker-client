import { ApiFetchAllResponse, ApiServiceApi } from "./backend/api";
import {
  INITIAL_LOAD_START,
  InitialLoadData,
  initialLoadSuccess,
} from "./actions";
import { call, put, takeEvery } from "redux-saga/effects";

export function* watchInitialLoad(api: ApiServiceApi) {
  yield takeEvery(INITIAL_LOAD_START, initialLoad, api);
}

function* initialLoad(api: ApiServiceApi) {
  const data: ApiFetchAllResponse = yield call(api.fetchAll.bind(api));
  // We do a risky cast here because the types just "happen" to line up, except that the client's
  // fields aren't nullable. We don't expect the server to ever send null fields though.
  // TODO(james): Check for nullables.
  yield put(initialLoadSuccess(data as InitialLoadData));
}
