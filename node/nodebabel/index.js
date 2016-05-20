// 1. .babelrc 文件是必须的 它配置了一个 babel 预设
// 2. 引入 hook babel-core/register 
require("babel-core/register");

var Demo = require('./components').default;
var fun = require('./components').fun;
var d = new Demo();

console.log(d.say());
fun();