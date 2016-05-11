// webpack 根据这个配置来打包资源
module.exports = {
    
    // 源文件
    entry: './src/entry.js',
    // 打包输出路径
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    
    module: {
        loaders: [
            // babel-loader 依赖 babel-core 和 babel-preset-es2015 需要手动安装上
            // 在 npm@3 之后 npm 不会自动安装 peerDependencies
            {test: /\.js$/, loader: 'babel', query: {presets: ['es2015']}}
        ]
    }
};
