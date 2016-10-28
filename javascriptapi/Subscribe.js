/**
 * 观察者模式
 */
function Subscribe() {
    /**
     * {
     *      'eventName': [fn1, fn2...]
     *      'eventName2': [fn1, fn2...]
     * }
     */
    this.handlers = {};
}
Subscribe.prototype = {
    constructor: Subscribe,
    
    /**
     * 注册事件处理
     *
     * @param string eventName 事件名称
     * @param function handler 回调函数
     */
    on: function(eventName, handler) {
        if(undefined === this.handlers[eventName]) {
            this.handlers[eventName] = [];
        }
        
        this.handlers[eventName].push(handler);
    },
    
    /**
     * 注销事件处理
     *
     * @param string eventName 事件名称
     * @param function handler 回调函数
     */
    off: function(eventName, handler) {
        if(undefined !== this.handlers[eventName]) {
            if(undefined === handler) {
                delete this.handlers[eventName];
                
            } else {
                for(var i=0,len=this.handlers[eventName].length; i<len; i++) {
                    if(handler === this.handlers[eventName][i]) {
                        this.handlers[eventName].splice(i, 1);
                    }
                }
            }
        }
    },
    
    /**
     * 触发
     *
     * @param string eventName 事件名称
     * @param array param 参数
     */
    trigger: function(eventName, param) {
        if(undefined !== this.handlers[eventName]) {
            for(var i=0,len=this.handlers[eventName].length; i<len; i++) {
                
                undefined === param ? this.handlers[eventName][i]() :
                    this.handlers[eventName][i].apply(null, param);
            }
        }
    }
};
