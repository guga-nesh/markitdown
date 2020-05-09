import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import LoginComponent from "./components/login/component_login";
import NoteListComponent from "./components/notelist/component_notelist";
import NoteEditComponent from "./components/note/component_note";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import { Provider } from "react-redux";
import store from "./redux/store";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Switch>

          <Route path="/login" >
            <LoginComponent />
          </Route>

          <Route path="/home">
            <NoteListComponent />
          </Route>

          <Route path="/edit">
            <NoteEditComponent />
          </Route>

          <Route>
            <Redirect to="/login" />
          </Route>

        </Switch>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
