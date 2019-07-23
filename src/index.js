import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const ClientID = "795413336079-u5lo5qfp8cror7k58lh6uei4f52c4mqp.apps.googleusercontent.com"

ReactDOM.render(<App clientId={ClientID} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
