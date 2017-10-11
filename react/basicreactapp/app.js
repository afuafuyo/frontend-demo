import React from 'react';
import { render } from 'react-dom';
import { Router, Route } from 'react-router';

import App from './containers/App';
import A from './containers/App/A.js';
import B from './containers/App/B.js';

render(
    <Router>
        <Route path='/' component={App}>
            <Route path='a' component={A} />
            <Route path='b' component={B} />
        </Route>
    </Router>,
    document.getElementById('app')
);
