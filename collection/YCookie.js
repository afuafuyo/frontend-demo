/**
 * YCookie cookie 操作类
 * @author yulipu
 *
 * 用法
 *	var c = new YCookie();
 *	c.setCookie('key', 'value', 'expiresHours');  // 设置 cookie
 *	var val = c.getCookie('key');  // 得到 cookie 值
 *	c.deleteCookie('key');  // 删除 cookie
 */
function YCookie() {
	this.doc = document;
}
YCookie.prototype = {
	constructor : YCookie
	,setCookie: function(name, value, expiresHours, options) {
		options = options || {};
		var cookieString = name + '=' + encodeURIComponent(value);
		//判断是否设置过期时间
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
	,getCookie: function(name) {
		// cookie 的格式是每一项用 分号和空格 分隔的字符串
		var arrCookie = this.doc.cookie ? this.doc.cookie.split('; ') : [],
			val = '',
			tmpArr = '';
			
		for(var i=0; i<arrCookie.length; i++) {
			tmpArr = arrCookie[i].split('=');
			tmpArr[0] = tmpArr[0].replace(' ', '');  // 去掉空格
			if(tmpArr[0] === name) {
				val = decodeURIComponent(tmpArr[1]);
				break;
			}
		}
		
		return val;
	}
	,deleteCookie: function(name, options) {
		this.setCookie(name, '', -1, options);
		//console.log(this.doc.cookie);
	}
};
