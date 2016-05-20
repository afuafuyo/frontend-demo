import React from 'react';

import ReactDOMServer from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { routes } from './routes';

import express from 'express';

var app = express();

app.use(function (req, res) {
    match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
        if (err) {
            res.status(500).end(`Internal Server Error ${err}`);
            
        } else if (redirectLocation) {
            res.redirect(redirectLocation.pathname + redirectLocation.search);
            
        } else if (renderProps) {
            res.status(200).send(ReactDOMServer.renderToString( <RouterContext {...renderProps}/> ));
            
        } else {
            res.status(404).end('Not found');
        }
    });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});