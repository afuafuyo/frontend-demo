/**
 * XCookie 操作类
 *
 * @author afu
 *
 * eg.
 *
 * var c = new XCookie();
 * c.setCookie('key', 'value', 'expiresHours');  // 设置 cookie
 * var val = c.getCookie('key');  // 得到 cookie 值
 * c.deleteCookie('key');  // 删除 cookie
 *
 */
function XCookie() {
    this.doc = document;
}
XCookie.prototype = {
    constructor : XCookie
    
    /**
     * 设置 cookie
     *
     * @param {String} name
     * @param {String} value
     * @param {Number} expiresHours
     * @param {Object} options
     */
    ,setCookie: function(name, value, expiresHours, options) {
        options = options || {};
        
        var cookieString = name + '=' + encodeURIComponent(value);
        
        // expires
        if(undefined !== expiresHours){
            var date = new Date();
            date.setTime(date.getTime() + expiresHours * 3600 * 1000);
            cookieString = cookieString + '; expires=' + date.toUTCString();
        }
        
        var other = [
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join('');
        
        this.doc.cookie = cookieString + other; 
    }
    
    /**
     * 获取 cookie
     *
     * @param {String} name
     * @return String | null
     */
    ,getCookie: function(name) {
        var cookies = this.doc.cookie;
        
        if('' === cookies) {
            return null;
        }
        
        // cookie 'xxx=xxx; xxx=xxx'
        var arr = cookies.split('; ');
        var ret = '',
        var tmp = null;
            
        for(var i=0; i<arr.length; i++) {
            tmp = arr[i].split('=');
            // tmp[0] = tmp[0].replace(' ', '');  // trim space
            
            if(name === tmp[0]) {
                ret = decodeURIComponent(tmp[1]);
                break;
            }
        }
        
        return ret;
    }
    
    /**
     * 删除 cookie
     *
     * @param {String} name
     * @param {Object} options
     */
    ,deleteCookie: function(name, options) {
        this.setCookie(name, '', -1, options);
    }
};
