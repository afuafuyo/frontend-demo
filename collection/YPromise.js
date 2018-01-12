/**
 * Promise 实现
 *
 *  var p = new YPromise(function(resolve){
 *      setTimeout(function(){
 *          resolve('result data');
 *      }, 2000);
 *  });
 *
 *  p.then(function(v){
 *      console.log('first:' + v);
 *      return '123';
 *  })
 *  .then(function(v){
 *      console.log('second:' + v)
 *  });
 *
 */
function YPromise(executor) {
    this.thens = [];
    
    if('function' === typeof executor) {
        executor(this.resolve.bind(this));
    }
};
YPromise.prototype = {
    constructor: YPromise,
    resolve: function(data) {
        var callback = null;
        for(var i=0,len=this.thens.length; i<len; i++) {
            if('function' === typeof (callback = this.thens[i])) {
                data = callback.call(this, data);
            }
        }
        /*
        while('function' === typeof (callback = this.thens.shift())) {
            data = callback.call(this, data);
        }
        */
    },
    then: function(n) {
        return this.thens.push(n), this;
    }
};
