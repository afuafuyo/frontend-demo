// webpack 根据这个配置来打包资源
module.exports = {
    
    // 由于我们有很多页面 我们想每个页面对应一个 js 文件
    entry: {
        page1: './src/page1.js',
        page2: './src/page2.js',
    },
    // 打包输出路径 会生成 page1.js 和 page2.js
    output: {
        path: __dirname + '/dist',
        filename: '[name].js'  // name 对应上面 entry 的键
    },
    
    module: {
        loaders: [
        ]
    }
};

// 生成的 page1.js 源码
/*
(function(modules) {
    var installedModules = {};

    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) return installedModules[moduleId].exports;
        var module = installedModules[moduleId] = {
            exports: {},
            id: moduleId,
            loaded: false
        };
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.loaded = true;
        return module.exports
    }
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.p = "";
    return __webpack_require__(0)
    
})([function(module, exports) {
    console.log('page1')
}]);
*/