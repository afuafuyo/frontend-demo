// 1. .babelrc 文件是 babel6 必须的
//  babel 默认不带任何转换器
//  如果在命令行你对代码使用 babel 命令 那么代码会原样输出
//  你需要配置 .babelrc 文件让 babel 知道你要怎么转换代码
//      
// 2. 引入 hook babel-core/register 做代码自动编译
require("babel-core/register");

var Demo = require('./components').default;
var fun = require('./components').fun;
var d = new Demo();

console.log(d.say());
fun();