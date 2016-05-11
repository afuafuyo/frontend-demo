// webpack 根据这个配置来打包资源
module.exports = {
    
    // 源文件路径
    entry: './src/entry.js',
    // 打包输出路径
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
        // 我们在 css 中使用了一张图片平铺 body
        // 由于 webpack 打包时会把 css 中的用到的本地图片抽取出来 放到输出路径 ( 这里是 dist ) 下 这样图片路径就发生了变化
        // 此项设置就是解决这个路径问题 它会把 css 中图片路径更改到这里设置的路径
        publicPath: './dist/'
    },
    
    module: {
        // webpack 只能原生处理 js 模块
        // 为了使得图片作为模块使用 我们需要 url-loader 这里 1K 以内的图片我们转译成 base64
        // 由于 url-loader 是 file-loader 的封装 所以你也需要安装这个 loader
        loaders: [
            {test: /\.css/, loader: 'style!css'},
            {test: /\.(png|jpg)$/, loader: 'url-loader?limit=1024'}
        ]
    }
};