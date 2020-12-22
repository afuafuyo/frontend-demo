// 运行 node test.js 执行该文件

const D = require('../dist/bundle.js');

// 因为 export default 会被编译成一个对象带有一个 default 属性
// 所以这里写法如下
// 源码中使用 module.exports = xxx 就不会存在这个问题
console.log(new D.default().todo());
