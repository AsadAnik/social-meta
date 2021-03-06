import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes/router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import reduxThunk from 'redux-thunk';
import Reducers from './redux/reducers';

// Creating store with middleware..
const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, reduxThunk)(createStore);

const App = () => {
  return (
    <Provider store={createStoreWithMiddleware(Reducers)}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
