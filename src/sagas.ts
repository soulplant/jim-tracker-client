import {
  ADD_USER,
  AddUserAction,
  INITIAL_LOAD_START,
  InitialLoadData,
  REPOSITION_USER,
  RepositionUserAction,
  SET_NEXT_TALK_NAME,
  SET_USER_NAME,
  SetNextTalkNameAction,
  SetUserNameAction,
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
  const data: ApiFetchAllResponse = yield call([api, api.fetchAll]);
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

function* handleAddUser(api: ApiServiceApi, action: AddUserAction) {
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
export function* attemptReposition(api: ApiServiceApi): IterableIterator<{}> {
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

export function* watchUserChanges(api: ApiServiceApi) {
  // TODO(james): Merge these two actions.
  yield takeEvery([SET_USER_NAME, SET_NEXT_TALK_NAME], updateUserChange, api);
}

function* updateUserChange(
  api: ApiServiceApi,
  action: SetUserNameAction | SetNextTalkNameAction
) {
  if (action.type == SET_USER_NAME) {
    const req = {
      name: action.name,
    };
    yield call([api, api.updateUser], action.userId, req);
    return;
  }
  if (action.type == SET_NEXT_TALK_NAME) {
    const req = {
      id: action.userId,
      nextTalkName: action.name,
    };
    yield call([api, api.updateUser], action.userId, req);
    return;
  }
}
