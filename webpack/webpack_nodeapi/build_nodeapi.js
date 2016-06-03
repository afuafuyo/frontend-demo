/**
 * node.js 使用 webpack
 */
var webpack = require('webpack');
var config = require('./webpack.config');

/**
 * webpack() 返回一个编译器实例 实例有如下方法
 * void run(Function:callback)
 *      编译代码
 * Watching watch(Object:watchOptions, Function:handler)
 *      编译代码并返回一个 watcher 实例 它会监听代码改变并自动重新编译 所以使用 watch 后不需要使用 run
 *      关于自动监听编译代码 不知为什么 在本地实验并不起作用
 *      watchOptions
 *          aggregateTimeout 编译延迟时间 毫秒
 *          poll watcher 类型
 *
 * Watching 对象方法
 *      close(Function:callback)
 */
var compiler = webpack(config);

// 编译代码
/*
compiler.run(function(err, stats){
    console.log(stats);
});
*/

// watch 编译代码
var watching = compiler.watch({
    aggregateTimeout: 300,
    poll: true
    
}, function(err, stats){
    console.log('build');
});
