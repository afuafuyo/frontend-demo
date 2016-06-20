var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    // The standard entry point and output config
    entry: {
        post: "./src/post.js",
        about: "./src/about.js"
    },
    output: {
        filename: "./dist/[name].js",
        chunkFilename: "./dist/[id].js"
    },
    module: {
        loaders: [
            // Extract css files
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
                
                // 下面这种形式会把 css 嵌入到 js 中 使用 js 动态输出 css
                //loader: 'style!css'
            }
        ]
    },
    // Use the plugin to specify the resulting filename (and add needed behavior to the compiler)
    plugins: [
        // 生成分离的 css 文件
        new ExtractTextPlugin("./dist/[name].css")
    ]
}
