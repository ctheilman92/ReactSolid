//react imports
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

//redux imports
import thunk from 'redux-thunk' //this will help with asynchronous operation
import myApp from './reducers'  //reducers for redux store
import { Provider } from 'react-redux'  //provide the redux store for top-down presentational components
import { createStore, applyMiddleware } from 'redux'

//thunk async api action creators
import { loadWeb3 } from './actions/index.js'

const store = createStore(myApp, applyMiddleware(thunk));
store.dispatch(loadWeb3());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('root')
);
