var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'develop';

module.exports = {
    entry: {
        app: ['./src/index.js']
    },
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
        publicPath: '/public'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        // 用到了两个 babel 预设
                        // 一个用来转译 es6 代码
                        // 一个用来转译 react 代码
                        // 这两个预设需手动安装
                        presets: ['es2015', 'react']
                    }
                }
            },
            {
                test: /\.css$/,
                // css loader 实现模块化加载 css 文件
                // style loader 实现把加载的 css 文件插入 html 的 <style> 中
                // 也可以使用其它插件生成一个单独的 css 文件 而不是插入到 html 的 <style> 中
                use: ['style-loader', 'css-loader']
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            // 自定义属性
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