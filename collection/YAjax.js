/**
 * 简单的 ajax 封装方法
 * @Author yulipu
 * @version 1.0
 *
 * @param receiveType 返回数据类型 [html xml json]
 *
 * 用法
 *
 *  var xmlhttp = new YAjax('html');  // 不填参数默认就是 html
 *  xmlhttp.post('ajax.php', 'name=zhangsan', function(s) {
 *      document.getElementById('conDiv').innerHTML = s;
 *  });
 *
 *  var xmlhttp = new YAjax('json');
 *  xmlhttp.get('ajax.php?param=1', function(json) {
 *      alert(json.xxx);
 *  });
 * 
 */
function YAjax(receiveType) {
    this.receiveType = (undefined === receiveType ? 'html' : receiveType);
    this.callback = null;  // 回调函数

    this.xmlhttp = this.init(); // xmlHttpRequest 对象
}

/**
 * 处理回调
 */
YAjax.prototype.processCallBack = function() {
    if(this.xmlhttp.readyState === 4) {
        if(200 === this.xmlhttp.status || 0 === this.xmlhttp.status) {
            if(this.receiveType === 'html') {
                this.callback(this.xmlhttp.responseText);

            } else if(this.receiveType === 'xml') {
                this.callback(this.xmlhttp.responseXML);

            } else if(this.receiveType === 'json') {
                try {
                    this.callback(JSON.parse(this.xmlhttp.responseText));
                } catch (e) {
                    var str = '(' + this.xmlhttp.responseText + ')';
                    this.callback(eval(str));
                }

            } else {
                // others
            }
        }
    }
};

/**
 * 初始化 xmlHttpRequest 对象
 */
YAjax.prototype.init = function() {
    var xmlhttp = null;

    // 需要针对不同轮浏览器建立这个对象的不同方式写不同代码
    if(window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
        // 针对某些特定版本的 Mozillar 浏览器的 BUG 进行修正
        if(xmlhttp.overrideMimeType) {
            xmlhttp.overrideMimeType("text/xml");
        }

    } else if(window.ActiveXObject) {
        var activexName = ['MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
        for (var i=0,len=activexName.length; i<len; i++) {
            try {
                xmlhttp = new ActiveXObject(activexName[i]);
                break;
            } catch (e) {}
        }
    }

    return xmlhttp;
};

/**
 * post 方式发送请求
 * @param string targetUrl 服务端地址
 * @param string data 发送的数据
 * @param function callback 回调函数
 */
YAjax.prototype.post = function(targetUrl, data, callback) {
    var _this = this;
    if('function' === typeof callback) {
        _this.callback = callback;
        _this.xmlhttp.onreadystatechange = function(){ _this.processCallBack(); };
        _this.xmlhttp.open('POST', targetUrl, true); // 打开与服务器连接
        _this.xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        _this.xmlhttp.send(data); // 发送内容到服务器
    }
};

/**
 * get 方式发送请求
 * @param string targetUrl 服务端地址
 * @param function callback 回调函数
 */
YAjax.prototype.get = function(targetUrl, callback) {
    var _this = this;
    if('function' === typeof callback) {
        _this.callback = callback;
        _this.xmlhttp.onreadystatechange = function(){ _this.processCallBack(); };

        //if(window.XMLHttpRequest) {
        _this.xmlhttp.open('GET', targetUrl);
        _this.xmlhttp.send(null);
        //} else {
        //    _this.xmlhttp.open('GET', targetUrl, true);
        //    _this.xmlhttp.send();
        //}
    }
};
