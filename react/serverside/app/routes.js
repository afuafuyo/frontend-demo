import React from 'react';
import { Route } from 'react-router';
import {DefaultContent, Content1, Content2} from './components';

export var routes = (
    <Route path="/" component={DefaultContent} >
        <Route path="page1" component={Content1} />
        <Route path="page2" component={Content2} />
    </Route>
);
