module.exports = {
    entry: {
        app: [__dirname + '/app.js']
    },
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
        // 网站运行时的访问路径
        publicPath: '/public/'
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
    }
};