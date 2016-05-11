// webpack 根据这个配置来打包资源
module.exports = {
    
    // 源文件路径
    entry: './src/entry.js',
    // 打包输出路径
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    
    module: {
        // webpack 只能原生处理 js 模块
        // 为了使得 css 可以作为模块来引用 我们需要使用 css-loader
        // 为了在 dom 中自动生成 style 标签存放我们的 css 我们需要使用 style-loader
        loaders: [
            {test: /\.css/, loader: 'style!css'}
        ]
    }
};