import {
  ADD_USER,
  AddUserAction,
  INITIAL_LOAD_START,
  InitialLoadData,
  initialLoadSuccess,
  updateLocalId,
} from "./actions";
import {
  ApiAddUserResponse,
  ApiFetchAllResponse,
  ApiServiceApi,
} from "./backend/api";
import { call, put, takeEvery } from "redux-saga/effects";

export function* watchInitialLoad(api: ApiServiceApi) {
  yield takeEvery(INITIAL_LOAD_START, handleInitialLoad, api);
}

function* handleInitialLoad(api: ApiServiceApi) {
  const data: ApiFetchAllResponse = yield call(api.fetchAll.bind(api));
  // We do a risky cast here because the types just "happen" to line up, except that the client's
  // fields aren't nullable. We don't expect the server to ever send null fields though.
  // TODO(james): Check for nullables.
  yield put(initialLoadSuccess(data as InitialLoadData));
}

export function* watchAddUser(api: ApiServiceApi) {
  yield takeEvery(ADD_USER, handleAddUser, api);
}

function* handleAddUser(
  api: ApiServiceApi,
  action: AddUserAction
): IterableIterator<any> {
  const resp = (yield call([api, api.addUser], {
    name: action.userName,
  })) as ApiAddUserResponse;
  yield put(updateLocalId("user", action.localId, resp.user!.id!));
}
