require('babel-core/register');

var React = require('react');
var ReactDOMServer = require('react-dom/server');

var List = require('./components/List');

// 采用 createElement 方式初始化组件
var element = React.createElement(List, {data: ['data1', 'data2', 'data3', 'data4']}, null);
var renderString = ReactDOMServer.renderToString(element);

console.log(renderString);