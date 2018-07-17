/**
 * fetch
 *
 * eg.
 *
 * new XFetch().fetch(url, options).then(() => {}).then(...);
 *
 * options:
 *
 * method: String  请求方法
 * body: String  请求实体
 * headers: String  头字段
 * withCredentials: Boolean
 *
 */
function XFetch() {
    this.xhr = null;
    this.resolve = null;
    this.reject = null;
}
XFetch.prototype = {
    constructor: XFetch,
    readyStateChange: function() {
        if(4 !== this.xhr.readyState) {
            return;
        }
        
        var status = this.xhr.status;
        if(status < 100 || status > 599) {
            this.reject(new Error('Network request failed'));
          
            return;
        }
        
        this.xhr.onreadystatechange = null;
        
        this.resolve(new XFetch.Response({
            status: status,
            statusText: this.xhr.statusText,
            body: this.xhr.responseText
        }));
    },
    error: function() {
        this.xhr.onerror = null;
    },
    fetch: function(url, options) {
        var _self = this;
        var InternalPromise = window.Promise || XFetch.Promise;
        
        if(undefined === options) {
            options = {};
        }
        
        return new InternalPromise(function(resolve, reject){
            var req = new XFetch.Request(url, options);
            
            _self.resolve = resolve;
            _self.reject = reject;
            
            _self.xhr = new XMLHttpRequest();
            
            _self.xhr.onreadystatechange = function() {
                _self.readyStateChange();
            };
            //_self.xhr.onerror = function() {
            //    _self.error();
            //};
            
            _self.xhr.open(req.method, req.url, true);
            
            // credentials
            if(req.withCredentials) {
                _self.xhr.withCredentials = true;
            }
            
            // headers
            if(null !== req.headers) {
                for(var k in req.headers) {
                    this.xhr.setRequestHeader(k, req.headers[k]);
                }
            }
            
            _self.xhr.send(req.body);
        }); 
    }
};

/**
 * Promise
 */
XFetch.Promise = function(executor) {
    this.status = 'pending';
    this.thens = [];
    this.rejectFn = null;
    
    this.execute = function() {
        var _self = this;
        executor(/* resolve */function(data){
            _self.resolve.call(_self, data);
            
        }, /* reject */function(err){
            _self.reject.call(_self, err);
        });
    };
    
    if('function' === typeof executor) {
        this.execute();
    }
};
XFetch.Promise.prototype.resolve = function(data) {
    if('pending' !== this.status) {
        return;
    }
    
    this.status = 'accepted';

    var callback = null;
    var tmp = data;

    try {
        for(var i=0,len=this.thens.length; i<len; i++) {
            if('function' === typeof (callback = this.thens[i])) {
                tmp = callback.call(this, tmp);
            }
        }
        
    } catch(e) {
        this.reject(e);
    }
};
XFetch.Promise.prototype.reject = function(err) {
    this.status = 'rejected';
    
    if(null !== this.rejectFn) {
        this.rejectFn(err);
    }
};
XFetch.Promise.prototype.then = function(fn) {
    return this.thens.push(fn), this;
};
XFetch.Promise.prototype.catch = function(fn) {    
    return this.rejectFn = fn, this;
};

/**
 * Request
 */
XFetch.Request = function(url, options) {
    this.url = url;
    
    this.method = undefined === options.method ? 'GET' : options.method.toUpperCase();
    this.body = undefined === options.body ? null : options.body;
    this.headers = undefined === options.headers ? null : options.headers;
    this.withCredentials = undefined === options.withCredentials ? false : true;
};

/**
 * Response
 */
XFetch.Response = function(options) {
    this.status = undefined === options.status ? 200 : options.status;
    this.statusText = undefined === options.statusText ? '' : options.statusText;
    this.body = undefined === options.body ? null : options.body;
};
XFetch.Response.prototype.json = function() {
    return JSON.parse(this.body);
};
