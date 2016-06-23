var path = require('path');

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import createLocation from 'history/lib/createLocation';
import express from 'express';

import configureStore from './common/store/configureStore';
import routes from './common/routes';

var app = express();

// 输出页面
var renderFullPage = function(html, initialState){
    return `
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <title></title>
        <link rel="stylesheet" type="text/css" href="">
    </head>
    <body>
        <div id="root">${html}</div>
        <script>
        window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}; 
        </script>
        <script src="/static/bundle.js"></script>
    </body>
</html>
`;
};

app.use('/static', express.static(path.join(__dirname, '/../dist')));

app.use(function (req, res) {
    // 做登录验证 ...
    
    const location = createLocation(req.url);
    
    match({ routes, location }, (err, redirectLocation, renderProps) => {
        if(err) {
            res.sendStatus(500).end(`Internal Server Error ${err}`);
            
        } else if (redirectLocation) {
            res.redirect(redirectLocation.pathname + redirectLocation.search);
            
        } else if (renderProps) {
            var store = configureStore(undefined);
            var initialState = store.getState();
            var InitialView = (
                <Provider store={store}>
                    <RouterContext {...renderProps} />
                </Provider>
            );
            
            // `RoutingContext` has been renamed to `RouterContext`.
            var str = ReactDOMServer.renderToString( InitialView );
            res.send(renderFullPage(str, initialState));
            
        } else {
            res.sendStatus(404).end('Not found');
        }
    });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
