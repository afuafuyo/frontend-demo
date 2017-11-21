import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom';

import App from './containers/App';
import A from './containers/App/A.js';
import B from './containers/App/B.js';

render(
    <HashRouter>
        <Switch>
            <Route exact path='/' component={App}/>
            <Route path='/a' component={A}/>
            <Route path='/b' component={B}/>
        </Switch>
    </HashRouter>,
    document.getElementById('app')
);
