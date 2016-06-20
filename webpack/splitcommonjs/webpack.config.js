var webpack = require("webpack");

// 把 entry 用到的公共代码生成 common.js 文件
module.exports = {
    entry: { a: "./src/a", b: "./src/b" },
    output: { filename: "./dist/[name].js" },
    plugins: [ new webpack.optimize.CommonsChunkPlugin("./dist/common.js") ]
};
