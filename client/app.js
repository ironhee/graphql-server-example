import 'babel/polyfill';
import {createHashHistory} from 'history';
import {IndexRoute, Route, Router} from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactRouterRelay from 'react-router-relay';
import DraftApp from './components/DraftApp';
import DraftList from './components/DraftList';
import ViewerQueries from './queries/ViewerQueries';

ReactDOM.render(
  <Router
    createElement={ReactRouterRelay.createElement}
    history={createHashHistory({ queryKey: false })}
  >
    <Route
      path="/"
      component={DraftApp}
      queries={ViewerQueries}
    >
      <IndexRoute
        component={DraftList}
        queries={ViewerQueries}
        prepareParams={() => ({status: 'any'})}
      />
      <Route
        path=":status"
        component={DraftList}
        queries={ViewerQueries}
      />
    </Route>
  </Router>,
  document.getElementById('app')
);
