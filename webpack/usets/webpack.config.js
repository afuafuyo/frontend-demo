const path = require('path');

const webpack = require('webpack');

const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

module.exports = {
    mode: 'development',
    entry: {
        app: ['./src/index']
    },
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
        publicPath: '/',

        libraryTarget: 'commonjs'
    },
    resolve: {
        // 配置查找的文件类型
        extensions: ['.js', '.ts'],
        modules: [path.join(__dirname, 'src'), 'node_modules']
    },
    module: {
        rules: [
            {
                test: /\.(js|ts)$/,
                exclude: /node_modules/,
                use: {
                    // babel.config 文件告诉 babel 如何转换文件
                    loader: 'babel-loader'
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(NODE_ENV)
            }
        })
    ]
};
