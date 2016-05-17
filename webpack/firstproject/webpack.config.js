// webpack 原生直接支持 AMD 和 CommonJS 两种规范
// 如果想使用 ES6 的风格 需要使用插件

// 自动帮我们生成 html 的插件 不用我们自己手动创建一个 html 文件了
var HtmlwebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // 在使用 dev-server 时必须使用 绝对路径
    entry: {
        app: [__dirname + '/app/index.js']
    },
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
        // 网站运行时的访问路径 在 WebpackDevServer ( 在 server.js 中 ) 实例中会用到
        // 使用这项配置后 访问 js 等资源需要加 public 前缀才能访问到资源
        // css 等中使用到的路径 webpack 会自动帮我们替换
        publicPath: '/public/'
    },
    
    // 配置我们需要的插件
    // 如果不想自动生成 html 那么你自己的 html 中需要手动引入 webpack 打包的 bundle.js 文件
    // 比如我们自己的 index.html 引入 js http://domain:port/public/bundle.js
    // 如果使用了此插件 那么我们直接访问 http://domain:port/ 就能访问到自动生成的 html 文件
    // 这个 html 自动引入了 bundle.js
    // 注意 
    //   如果设置了 publicPath 那么访问自动生成的 html 时需要在 url 上加上 publicPath 的值才能访问到
    //   http://domain:port/public/
    /*
    plugins: [
        new HtmlwebpackPlugin({
            title: 'Hello World App'
        })
    ]
    */
};