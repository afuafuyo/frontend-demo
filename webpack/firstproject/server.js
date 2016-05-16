var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");

var config = require('./webpack.config');
// 每次修改代码自动刷新页面的配置
config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/");
var compiler = webpack(config);

var server = new WebpackDevServer(compiler, {
    // 指定网站资源访问路径
    publicPath: config.output.publicPath
});

// 服务启动后 访问的话默认加载 index.html
// 所以我们自己的 html 起名叫做 index.html
server.listen(8080, "localhost", function() {});
