import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import './bulma.css';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { reducer } from './reducers';

import App from './containers/App';
import { initialLoadSuccess, initialLoadStart, InitialLoadData } from './actions';
import { ApiServiceApi } from './backend/api';
import { ApiFetchAllResponse } from './backend/index';

declare var window: Window & { __REDUX_DEVTOOLS_EXTENSION__?: Function };

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.dispatch(initialLoadStart());
const api = new ApiServiceApi(undefined, '/api');

api.fetchAll().then(result => store.dispatch(initialLoadSuccess(parseServerData(result))));

// Parses the data the server returns into a format that the client understands.
// Currently the types in the client are kept in sync with the protos manually.
function parseServerData(result: ApiFetchAllResponse): InitialLoadData {
  // TODO(james): Do something safer.
  return result as InitialLoadData;
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
