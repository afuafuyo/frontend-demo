function PromiseAP(executor) {    
    this.resolver = new PromiseAPResolver();
        
    this._run = function() {
        var _self = this;
        
        executor(function /* resolve */ (data){
            _self.resolver.resolve(data);
            
        }, function /* reject */ (err){
            _self.resolver.reject(err);
        });
    };
    
    if('function' === typeof executor) {
        this._run();
    }
};
// static methods
PromiseAP.all = function(iterable) {
    
};
PromiseAP.race = function(iterable) {
    
};
PromiseAP.reject = function(reason) {
    
};
PromiseAP.resolve = function(value) {
    
};
// prototype methods
PromiseAP.prototype.then = function(callback, errCallback) {    
    var _self = this;
    
    // 非 pending 状态下调用 then 需要清空原来的数据 避免重复执行
    if(PromiseAPResolver.STATE_PENDING !== this.resolver.state) {
        this.resolver.callbackList = [];
        this.resolver.errorCallbackList = [];
        this.resolver.nextResolveRejectRefs = [];
    }
    
    var promise = new PromiseAP(function(resolve, reject){
        // resolve 会导致 then 的执行
        // 那么执行新生成的 promise 的 resolve 会导致新生成的 promise 的 then 的执行
        
        // 在链式 then 调用中 前一个 then 执行完毕 紧接着会执行下一个 then
        // 所以这里保存了一个新生成的 promise 的 resolve
        // 执行这个 resolve 就会让新 promise 的 then 执行了
        _self.resolver.nextResolveRejectRefs.push({
            resolve: resolve,
            reject: reject
        });
    });
    
    this.resolver.addCallback(callback, errCallback);
    
    return promise;
};
PromiseAP.prototype.catch = function(fn) {};
PromiseAP.prototype.finally = function(fn) {};

// resolver
function PromiseAPResolver() {
    this.state = PromiseAPResolver.STATE_PENDING;
    this.result = undefined;
    
    this.callbackList = [];
    this.errorCallbackList = [];
    this.nextResolveRejectRefs = [];
    
    this.async = function(fn) {
        setTimeout(fn, 1);
    };
    
    this.resolve = function(data) {
        if(PromiseAPResolver.STATE_PENDING !== this.state) {
            return;
        }
        
        this.state = PromiseAPResolver.STATE_FULFILLED;
        this.result = data;
        
        var _self = this;
        this.async(function() {
            _self.runThens(_self.callbackList, _self.result);
        });
    };
    
    this.fulfill = function() {
        if(PromiseAPResolver.STATE_PENDING === this.state) {
            this.state = PromiseAPResolver.STATE_FULFILLED;
        }
        
        if(PromiseAPResolver.STATE_FULFILLED === this.state) {
            this.runThens(this.callbackList, this.result);
        }
    };
    
    this.reject = function(err) {
        if(PromiseAPResolver.STATE_PENDING === this.state) {
            this.state = PromiseAPResolver.STATE_REJECTED;
        }
        
        if(PromiseAPResolver.STATE_REJECTED === this.state) {
            this.runThens(this.errorCallbackList, err);
        }
    };
    
    this.runThens = function(callbackList, result) {
        if(PromiseAPResolver.STATE_FULFILLED !== this.state) {
            return;
        }
        
        try {
            var tmp = '';
            for(var i=0,len=callbackList.length; i<len; i++) {
                tmp = callbackList[i](result);
                
                // 让链式 then 调用中的下一个 then 执行
                // 并将前一个 then 的返回值传过去
                this.nextResolveRejectRefs[i].resolve(tmp);
            }
                        
        } catch(e) {
            
        }
    };
    
    this.addCallback = function(callback, errCallback) {
        this.callbackList.push(callback);
        this.errorCallbackList.push(errCallback);
        
        switch(this.state) {
            case PromiseAPResolver.STATE_PENDING:
                break;
            case PromiseAPResolver.STATE_FULFILLED:
                this.fulfill();
                
                break;
            case PromiseAPResolver.STATE_REJECTED:
                break;
            default:
                break;
        }
    };
};
PromiseAPResolver.STATE_PENDING = 1;
PromiseAPResolver.STATE_FULFILLED = 2;
PromiseAPResolver.STATE_REJECTED = 3;