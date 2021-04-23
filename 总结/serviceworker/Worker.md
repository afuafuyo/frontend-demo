## worker

Worker 接口是 Web Workers API 的一部分，是一种可由脚本创建的后台任务，任务执行中可以向其创建者回发信息

```javascript
// myworker.js
onmessage = function(e) {
    const data = e.data;

    const workerResult = 'data processed: ' + data;

    postMessage(workerResult);
}
```



```javascript
// index.js
var myWorker = new Worker('/myworker.js');
var btn = document.querySelector('.btn');

// 监听消息
myWorker.onmessage = function(e) {
    // output is: data processed: origin string info
    console.log(e.data);
};

btn.onclick = function() {
    myWorker.postMessage('origin string info');
}
```

