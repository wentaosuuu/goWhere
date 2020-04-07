import {createStore,combineReducers,applyMiddleware} from 'redux';

import './reducers';
import thunk from 'redux-thunk';
import reducers from "./reducers";

export default createStore(
  combineReducers(reducers),
  {

  },
  applyMiddleware(thunk)
);
