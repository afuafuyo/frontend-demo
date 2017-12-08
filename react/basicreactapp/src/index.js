import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import Home from './containers/Home';
import A from './containers/A';


import { combineReducers } from 'redux';
import HomeReducer from './containers/Home/reducer.js';
function enhancer(createStore) {
    return function(reducer, initialState) {
        var store = createStore(reducer, initialState);
    
        // todo
        
        // 理论上应该这么返回
        //return Object.assign({}, store, {...})
        
        store.originDispatch = store.dispatch;
        store.dispatch = function(action) {
            if('function' === typeof action) {
                return action(store.dispatch);
            }
            
            return store.originDispatch(action);
        }
        return store;
    };
}
// dispatch endhancer
function applyMiddlewareEnhancer(api) {
    var newDispatch = api.dispatch;
    var getState = api.getState;
    
    return function(oldDispatch) {
        
        // 最终返回值是 dispatch
        return function(action) {
            console.log('------ run my midware');
            if('function' === typeof action) {
                return action(newDispatch);
            }
            
            return oldDispatch(action);
        };
        
    };
}
const store = createStore(
    combineReducers({
        homeR: HomeReducer
    })
    ,undefined
    // 如果存在 enhancer 那么 createStore 返回值是 enhancer 的结果
    // enhancer 必须保证原来 createStore 返回的值 ( 比如 dispatch 或 getState) 在 enhancer 中也返回
    ,enhancer
    //,,applyMiddleware(applyMiddlewareEnhancer)
);

render(
<Provider store={store}>
    <HashRouter>
        <Switch>
            <Route exact path='/' component={Home}/>
            <Route path='/a' component={A}/>
        </Switch>
    </HashRouter>
</Provider>,
document.getElementById('app')
);
