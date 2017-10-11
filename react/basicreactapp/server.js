/**
 * 修改代码自动刷新有 2 中实现方式
 *      1. 添加 webpack-dev-server/client?http://<path>:<port>/ 到所有的 webpack 配置文件的 entry 中
 *      2. 在页面中引入 js 实现自动刷新 即 <script src="/webpack-dev-server.js"></script>
 *
 *      下面代码使用第一种方式实现自动刷新
 *
 * Hot Module Replacement with node.js API 3 步
 *      add an entry point to the webpack configuration: webpack/hot/dev-server
 *      add the new webpack.HotModuleReplacementPlugin() to the webpack plugins configuration
 *      add hot: true to the webpack-dev-server configuration to enable HMR on the server
 *
 *  // webpack.config.js 的 plugins 配置项中增加 new webpack.HotModuleReplacementPlugin()
 *  var config = require("./webpack.config.js");
 *  config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/", "webpack/hot/dev-server");
 *  var server = new webpackDevServer(webpack(config), {
 *      hot: true
 *      ...
 *  });
 *  server.listen(8080);
 *
 */
var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");

var config = require('./webpack.config');     
config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/",
    "webpack/hot/dev-server");

var server = new WebpackDevServer(webpack(config), {
    hot: true,
    publicPath: config.output.publicPath
});
server.listen(8080, "localhost", () => {
    console.log('listen on 8080')
});
