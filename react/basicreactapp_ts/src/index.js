import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom';

import Home from './containers/Home/index.tsx';

ReactDOM.render(
<HashRouter>
    <Switch>
        <Route exact path='/' component={Home}/>
    </Switch>
</HashRouter>,
document.getElementById('app')
);
