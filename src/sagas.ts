import {
  ADD_USER,
  AddUserAction,
  INITIAL_LOAD_START,
  InitialLoadData,
  REPOSITION_USER,
  RepositionUserAction,
  UPDATE_LOCAL_ID,
  initialLoadSuccess,
  resolveReposition,
  updateLocalId,
} from "./actions";
import {
  ApiAddUserResponse,
  ApiFetchAllResponse,
  ApiReorderRequest,
  ApiReorderResponse,
  ApiServiceApi,
} from "./backend/api";
import { call, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import {
  getAnyLocalIds,
  getNextPendingReposition,
  getVersion,
} from "./selectors";

export function* watchInitialLoad(api: ApiServiceApi) {
  yield takeEvery(INITIAL_LOAD_START, handleInitialLoad, api);
}

function* handleInitialLoad(api: ApiServiceApi) {
  const data: ApiFetchAllResponse = yield call(api.fetchAll.bind(api));
  // We do a risky cast here because the types just "happen" to line up, except that the client's
  // fields aren't nullable. We don't expect the server to ever send null fields though.
  // TODO(james): Check for nullables.
  yield put(
    initialLoadSuccess({
      user: data.user || [],
      talk: data.talk || [],
    } as InitialLoadData)
  );
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

export function* watchRepositions(api: ApiServiceApi) {
  yield takeLatest([UPDATE_LOCAL_ID, REPOSITION_USER], attemptReposition, api);
}

// Will attempt to send a pending reposition request to the server. If it fails it will trigger a
// reset.
export function* attemptReposition(api: ApiServiceApi): IterableIterator<any> {
  // Check to see if there are any invalid
  const repositionBlocked: boolean = yield select(getAnyLocalIds);
  if (repositionBlocked) {
    return;
  }
  const reposition: RepositionUserAction = yield select(
    getNextPendingReposition
  );
  if (!reposition) {
    return;
  }
  const version: string = yield select(getVersion);
  const req: ApiReorderRequest = {
    anchorUserId: reposition.anchorUserId,
    before: reposition.before,
    // TODO(james): Rename the action field to 'moveUserId'.
    moveUserId: reposition.movedUserId,
    version,
  };
  const resp: ApiReorderResponse = yield call([api, api.reorder], req);
  if (!resp.accepted) {
    // TODO(james): Recover by reloading the list of users.
    throw new Error("server rejected our move :(");
  }
  // TODO(james): Do something with the version returned from the server.
  yield put(resolveReposition());

  // Recur so we can work our way through the list.
  yield call(attemptReposition, api);
}
