import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { reducer } from './reducers';

import TalkList from './containers/TalkList';
import { initialLoad } from './actions';

declare var window: Window & {__REDUX_DEVTOOLS_EXTENSION__?: Function};

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

store.dispatch(initialLoad({
  talk: [{
    id: '1',
    speakerId: '1',
    name: 'KK',
    links: [],
  }, {
    id: '2',
    speakerId: '1',
    name: 'RR',
    links: [],
  }],
  user: [{
    id: '1',
    name: 'James',
  }],
}));

ReactDOM.render(
  <Provider store={store}>
    <div>
      <TalkList />
    </div>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
