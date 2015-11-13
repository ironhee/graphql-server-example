import 'babel/polyfill';
import { createHashHistory } from 'history';
import { Route, Router } from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactRouterRelay from 'react-router-relay';
import App from './components/App';
import DraftPage from './components/DraftPage';
import PoolQueries from './queries/PoolQueries';

ReactDOM.render(
  <Router
    createElement={ReactRouterRelay.createElement}
    history={createHashHistory({ queryKey: false })}
  >
    <Route
      component={App}
    >
      <Route
        path="/"
        component={DraftPage}
        queries={PoolQueries}
      />
    </Route>
  </Router>,
  document.getElementById('app')
);
