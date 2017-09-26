import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import './bulma.css';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { reducer } from './reducers';

import App from './containers/App';
import { initialLoadSuccess } from './actions';
import { ApiServiceApi } from './backend/api';

declare var window: Window & { __REDUX_DEVTOOLS_EXTENSION__?: Function };

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const api = new ApiServiceApi(undefined, '/api');
api.fetchAll().then(result => console.log(JSON.stringify(result.talk![0].done)));

store.dispatch(
  initialLoadSuccess({
    talk: [
      {
        id: '1',
        speakerId: '1',
        name: 'KK',
        links: [],
        done: true
      },
      {
        id: '2',
        speakerId: '1',
        name: 'RR',
        links: [],
        done: false
      }
    ],
    user: [
      {
        id: '1',
        name: 'James'
      },
      {
        id: '2',
        name: 'Anu'
      }
    ]
  })
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
