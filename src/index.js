import React from 'react';
import ReactDOM from 'react-dom';
import App from './Front End/App';
import {BrowserRouter, Route} from 'react-router-dom';
import * as serviceWorker from './Front End/serviceWorker';
import Edit from './Front End/Edit';

const ClientID = "795413336079-u5lo5qfp8cror7k58lh6uei4f52c4mqp.apps.googleusercontent.com";

const serverRoot = "/karlysays"
const local = false
const genUrl = url => local ? url : `${serverRoot}${url}`

ReactDOM.render( <BrowserRouter>
      <Route path={genUrl("/")} exact render={() => {
          return <App clientId={ClientID} />
      }} />
      <Route path={genUrl("/quotezone")} exact component={Edit} />
  </BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
