/**
 * 配置修改代码自动刷新 2 中方式
 *      1. 添加 webpack-dev-server/client?http://<path>:<port>/ 配置到所有的 entry 中
 *      2. 在页面中引入 js 实现自动刷新 即 <script src="/webpack-dev-server.js"></script>
 *      这里我们使用第一种方式把配置放到我们的 entry ( 这里只有一个 entry ) 中实现自动刷新
 *
 * Hot Module Replacement with node.js API 3 步
 *      add an entry point to the webpack configuration: webpack/hot/dev-server
 *      add the new webpack.HotModuleReplacementPlugin() to the webpack plugins configuration
 *      add hot: true to the webpack-dev-server configuration to enable HMR on the server
 *
 *  var config = require("./webpack.config.js");  // plugins 配置中增加 new webpack.HotModuleReplacementPlugin()
 *  config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/", "webpack/hot/dev-server");
 *  var compiler = webpack(config);
 *  var server = new webpackDevServer(compiler, {
 *      hot: true
 *      ...
 *  });
 *  server.listen(8080);
 *
 */
var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");

var config = require('./webpack.config');     
config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/");
var compiler = webpack(config);

var server = new WebpackDevServer(compiler, {
    // 指定网站资源访问路径
    publicPath: config.output.publicPath
});

// 服务启动后 访问的话默认加载 index.html
// 所以我们自己的 html 起名叫做 index.html
server.listen(8080, "localhost", function() {});
