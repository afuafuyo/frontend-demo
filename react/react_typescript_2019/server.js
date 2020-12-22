var path = require('path');
var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");

var config = require('./webpack.config');
config.entry.app.unshift(
    "webpack-dev-server/client?http://localhost:8080/",
    "webpack/hot/dev-server");

var server = new WebpackDevServer(webpack(config), {
    hot: true,
    disableHostCheck: true,
    publicPath: config.output.publicPath,
    // 网站的部署目录 publicPath 基于该路径
    contentBase: path.join(__dirname, 'dist')
});
server.listen(8080, "localhost", () => {
    console.log('listen on 8080')
});
