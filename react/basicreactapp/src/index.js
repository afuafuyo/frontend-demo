import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom';

import Home from './containers/Home';
import A from './containers/A';

render(
    <HashRouter>
        <Switch>
            <Route exact path='/' component={Home}/>
            <Route path='/a' component={A}/>
        </Switch>
    </HashRouter>,
    document.getElementById('app')
);
