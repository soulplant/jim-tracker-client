import {
  ADD_USER,
  AddUserAction,
  COMPLETE_TALK,
  CONFIRMATION_RECEIVED,
  CompleteTalkAction,
  ConfirmationReceivedAction,
  INITIAL_LOAD_START,
  InitialLoadData,
  REMOVE_USER_FROM_ROTATION,
  REPOSITION_USER,
  RemoveUserFromRotationAction,
  RepositionUserAction,
  UPDATE_LOCAL_ID,
  UPDATE_USER,
  UpdateUserAction,
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
  ApiUpdateUserRequest,
} from "./backend/api";
import { call, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import {
  getAnyLocalIds,
  getNextPendingReposition,
  getVersion,
} from "./selectors";

export function* watchInitialLoad(api: ApiServiceApi) {
  yield takeEvery(INITIAL_LOAD_START, performInitialLoad, api);
}

function* performInitialLoad(api: ApiServiceApi) {
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

// Executes confirmed actions.
export function* watchConfirmedActions() {
  yield takeEvery(CONFIRMATION_RECEIVED, function*(
    action: ConfirmationReceivedAction
  ) {
    yield put(action.action);
  });
}

function* handleAddUser(api: ApiServiceApi, action: AddUserAction) {
  const resp = (yield call([api, api.addUser], {
    name: action.userName,
  })) as ApiAddUserResponse;
  yield put(updateLocalId("user", action.localId, resp.userId!));
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
  yield takeEvery([UPDATE_USER], updateUserChange, api);
}

function* updateUserChange(api: ApiServiceApi, action: UpdateUserAction) {
  const req: ApiUpdateUserRequest = { ...action.updates };
  if (req.name !== undefined) {
    req.hasName = true;
  }
  if (req.nextTalk !== undefined) {
    req.hasNextTalk = true;
  }
  yield call([api, api.updateUser], action.userId, req);
}

// Watches for when a user gets removed from the rotation and relays that to the
// server.
export function* watchUserRemovals(api: ApiServiceApi) {
  yield takeEvery(REMOVE_USER_FROM_ROTATION, applyUserRemovals, api);
}

function* applyUserRemovals(
  api: ApiServiceApi,
  action: RemoveUserFromRotationAction
) {
  try {
    yield call([api, api.removeUser], action.userId);
  } catch (e) {
    // TODO(james): Handle failed removals by reloading the app.
    throw e;
  }
}

export function* watchTalkCompletions(api: ApiServiceApi) {
  yield takeEvery(COMPLETE_TALK, applyTalkCompletions, api);
}

function* applyTalkCompletions(api: ApiServiceApi, action: CompleteTalkAction) {
  yield call([api, api.completeTalk], {
    userId: action.userId,
  });
  yield call(performInitialLoad, api);
}
