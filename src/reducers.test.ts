import { reducer } from "./reducers";
import { createStore } from "redux";
import { initialLoad } from "./actions";
import { getAllUsers, getAllTalks, getSpeaker } from "./selectors";

describe('reducers', () => {
  it('imports users properly', () => {
    const store = createStore(reducer);
    store.dispatch(initialLoad({
      talk: [],
      user: [{
        id: "1",
        name: "James",
      }],
    }));
    const allUsers = getAllUsers(store.getState());
    expect(allUsers).toHaveLength(1);
    expect(allUsers[0].id).toBe("1");
    expect(allUsers[0].name).toBe("James");
  });

  it('imports talks properly', () => {
    const store = createStore(reducer);
    store.dispatch(initialLoad({
      talk: [{
        id: "1",
        speakerId: "1",
        links: [],
        name: "Kazzam! It's Kubernetes!",
      }],
      user: [{
        id: "1",
        name: "James",
      }],
    }));
    const allTalks = getAllTalks(store.getState());
    expect(allTalks).toHaveLength(1);
    expect(allTalks[0].id).toBe("1");
    expect(allTalks[0].name).toBe("Kazzam! It's Kubernetes!");

    expect(getSpeaker(store.getState(), "1").name).toBe("James");
  });
})