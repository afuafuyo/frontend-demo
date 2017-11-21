var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'develop';

module.exports = {
    entry: {
        app: [__dirname + '/app.js']
    },
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
        publicPath: '/public'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    // 用到了两个 babel 预设
                    // 一个用来转译 es6 代码
                    // 一个用来转译 react 代码
                    // 这两个预设需手动安装
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'containers/index.html',
            staticPath: '/public'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(NODE_ENV)
            }
        }),
    ]
};