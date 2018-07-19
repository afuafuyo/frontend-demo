const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'develop';

module.exports = {
    mode: 'development',
    entry: {
        app: ['./src/index.js']
    },
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
        publicPath: '/public'
    },
    resolve: {
        // 配置查找的文件类型
        extensions: ['.js', '.ts', 'tsx'],
        // 配置模块可从以下路径查找
        modules: [path.join(__dirname, 'src'), 'node_modules']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    // .babelrc 文件告诉 babel 如何转换文件
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.tsx?$/,
                use: [
                    // .babelrc 文件告诉 babel 如何转换文件
                    { loader: 'babel-loader' },
                    // tsconfig.json 文件告诉 ts 如何转换文件
                    { loader: 'ts-loader' }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            // 自定义属性
            staticPath: '/public'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(NODE_ENV)
            }
        })
    ]
};
