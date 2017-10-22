import { Talk, User } from "./types";
import {
  addUser,
  init,
  initialLoadSuccess,
  scheduleNewTalk,
  toggleTalk,
  updateUser,
  repositionUser,
  updateLocalId,
} from "./actions";
import { getAllTalks, getAllUsers, getSpeaker, getTalkById } from "./selectors";
import { reducer, userReducer, requestQueue } from "./reducers";

import { createStore } from "redux";

const james: User = {
  id: "1",
  name: "james",
  nextTalk: "",
};

const talk1: Talk = {
  id: "1",
  name: "kk",
  speakerId: james.id,
  links: [],
  done: true,
};

describe("reducers", () => {
  it("imports users properly", () => {
    const store = createStore(reducer);
    store.dispatch(
      initialLoadSuccess({
        talk: [],
        user: [james],
      })
    );
    const allUsers = getAllUsers(store.getState());
    expect(allUsers).toHaveLength(1);
    expect(allUsers[0].id).toBe(james.id);
    expect(allUsers[0].name).toBe(james.name);
  });

  it("imports talks properly", () => {
    const store = createStore(reducer);
    store.dispatch(
      initialLoadSuccess({
        talk: [talk1],
        user: [james],
      })
    );
    const allTalks = getAllTalks(store.getState());
    expect(allTalks).toHaveLength(1);
    expect(allTalks[0].id).toBe(talk1.id);
    expect(allTalks[0].name).toBe(talk1.name);

    expect(getSpeaker(store.getState(), james.id).name).toBe(james.name);
  });

  it("toggles talks correctly", () => {
    const store = createStore(reducer);
    store.dispatch(
      initialLoadSuccess({
        talk: [talk1],
        user: [james],
      })
    );
    expect(talk1.done).toBe(true);
    store.dispatch(toggleTalk(talk1.id));
    expect(getTalkById(store.getState(), talk1.id).done).toBe(false);
  });

  it("creates new talks", () => {
    const store = createStore(reducer);
    store.dispatch(
      initialLoadSuccess({
        talk: [talk1],
        user: [james],
      })
    );
    store.dispatch(scheduleNewTalk(james.id));
    const allTalks = getAllTalks(store.getState());
    expect(allTalks).toHaveLength(2);
    // Local ids start with '-'.
    expect(allTalks[1].id).toMatch(/^-/);
  });
});

describe("user reducer", () => {
  it("allows users to set the name of talks", () => {
    let state = userReducer(undefined, init());
    state = userReducer(state, addUser(state.nextLocalId + "", "james"));
    expect(state.byId[state.order[0]].nextTalk).toBe("");
    state = userReducer(state, updateUser(state.order[0], { nextTalk: "foo" }));
    expect(state.byId[state.order[0]].nextTalk).toBe("foo");
  });

  it("allows users to set the name of users", () => {
    let state = userReducer(undefined, init());
    state = userReducer(state, addUser(state.nextLocalId + "", "james"));
    state = userReducer(state, updateUser(state.order[0], { name: "flames" }));
    expect(state.byId[state.order[0]].name).toBe("flames");
  });

  it("updates the next local id correctly", () => {
    let state = userReducer(undefined, init());
    state = userReducer(state, addUser(state.nextLocalId + "", "james"));
    expect(state.nextLocalId).toBe(-2);
  });
});

describe("queue reducer", () => {
  it("updates pending actions when a local id is resolved", () => {
    let state = requestQueue(undefined, init());
    state = requestQueue(state, repositionUser("-1", "5", true));
    state = requestQueue(state, updateLocalId("user", "-1", "123"));
    expect(state.pending[0].movedUserId).toBe("123");
    expect(state.pending[0].anchorUserId).toBe("5");
  });

  it("updates pending actions when a local id is resolved (anchor user id)", () => {
    let state = requestQueue(undefined, init());
    state = requestQueue(state, repositionUser("5", "-1", true));
    state = requestQueue(state, updateLocalId("user", "-1", "123"));
    expect(state.pending[0].movedUserId).toBe("5");
    expect(state.pending[0].anchorUserId).toBe("123");
  });
});
