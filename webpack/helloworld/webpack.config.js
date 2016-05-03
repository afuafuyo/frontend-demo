// webpack 根据这个配置来打包资源
module.exports = {
    // 多文件时
    /*
    entry: {
        js1: './src/entry.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].bundle.js'  // [name] 对应上面 entry 的键 即 js1 生成 js1.bundle.js
    },
    */
    // 单文件时
    entry: './src/entry.js',
    output: {
        path: __dirname + '/dist',
        filename: 'js1.bundle.js'
    },
    
    module: {
        loaders: [
            {test: /\.css/, loader: 'style!css'}
        ]
    }
};