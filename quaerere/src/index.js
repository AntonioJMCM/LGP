import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import Login from './components/login/Login';
import App from './components/app/App';
import Quiz from './components/quiz/Quiz';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Login />, document.getElementById('root'));

const routing = (
    <Router>
      <div>
        <Route exact path="/" component={Login} />
        <Route path="/profile" component={App} />
        <Route path="/Quiz" component={Quiz} />
      </div>
    </Router>
  )
  ReactDOM.render(routing, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
