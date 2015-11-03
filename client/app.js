import 'babel/polyfill';
import {createHashHistory} from 'history';
import {IndexRoute, Route, Router} from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactRouterRelay from 'react-router-relay';
import DraftApp from './components/DraftApp';
import DraftList from './components/DraftList';
import DraftsQueries from './queries/DraftsQueries';

ReactDOM.render(
  <Router
    createElement={ReactRouterRelay.createElement}
    history={createHashHistory({ queryKey: false })}
  >
    <Route
      path="/" component={DraftApp}
    >
      <IndexRoute
        component={DraftList}
        queries={DraftsQueries}
        prepareParams={() => ({status: 'any'})}
      />
      <Route
        path=":status" component={DraftList}
        queries={DraftsQueries}
      />
    </Route>
  </Router>,
  document.getElementById('app')
);
