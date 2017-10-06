import { Talk, User } from "./types";
import {
  addUser,
  init,
  initialLoadSuccess,
  scheduleNewTalk,
  setNextTalkName,
  toggleTalk,
} from "./actions";
import { getAllTalks, getAllUsers, getSpeaker, getTalkById } from "./selectors";
import { reducer, userReducer } from "./reducers";

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
    state = userReducer(state, addUser("james"));
    expect(state.byId[state.order[0]].nextTalk).toBe("");
    state = userReducer(state, setNextTalkName(state.order[0], "foo"));
    expect(state.byId[state.order[0]].nextTalk).toBe("foo");
  });
});
