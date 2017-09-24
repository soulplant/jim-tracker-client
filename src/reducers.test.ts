import { reducer } from './reducers';
import { createStore } from 'redux';
import { initialLoad, toggleTalk } from './actions';
import { getAllUsers, getAllTalks, getSpeaker, getTalkById } from './selectors';
import { User, Talk } from './types';

const james: User = {
  id: '1',
  name: 'james'
};

const talk1: Talk = {
  id: '1',
  name: 'kk',
  speakerId: james.id,
  links: [],
  done: true
};

describe('reducers', () => {
  it('imports users properly', () => {
    const store = createStore(reducer);
    store.dispatch(
      initialLoad({
        talk: [],
        user: [james]
      })
    );
    const allUsers = getAllUsers(store.getState());
    expect(allUsers).toHaveLength(1);
    expect(allUsers[0].id).toBe(james.id);
    expect(allUsers[0].name).toBe(james.name);
  });

  it('imports talks properly', () => {
    const store = createStore(reducer);
    store.dispatch(
      initialLoad({
        talk: [talk1],
        user: [james]
      })
    );
    const allTalks = getAllTalks(store.getState());
    expect(allTalks).toHaveLength(1);
    expect(allTalks[0].id).toBe(talk1.id);
    expect(allTalks[0].name).toBe(talk1.name);

    expect(getSpeaker(store.getState(), james.id).name).toBe(james.name);
  });

  it('toggles talks correctly', () => {
    const store = createStore(reducer);
    store.dispatch(
      initialLoad({
        talk: [talk1],
        user: [james]
      })
    );
    expect(talk1.done).toBe(true);
    store.dispatch(toggleTalk(talk1.id));
    expect(getTalkById(store.getState(), talk1.id).done).toBe(false);
  });
});
