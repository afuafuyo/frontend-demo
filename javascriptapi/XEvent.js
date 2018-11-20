/**
 * Event 自定义事件
 */
var XEvent = function() {
    /**
     * {
     *    'eventName': [
     *      {
     *        target: this,
     *        type: 'click',
     *        handler: 'fun',
     *        thisObject: 'obj'
     *      },
     *      ...
     *    ]
     * }
     */
    this.$eventBinMap = {};
};

XEvent.prototype = {
    constructor: XEvent,
    
    /**
     * 保存 event
     *
     * @param {String} eventName
     * @param {Function} handler
     * @param {Object} thisObject
     */
    $insertEventBin: function(eventName, handler, thisObject) {
        var map = this.$eventBinMap;
        
        if(undefined === map[eventName]) {
            map[eventName] = [];
        }
        
        var eventBin = {
            target: this,
            type: eventName,
            handler: handler,
            thisObject: thisObject
        };
        
        map[eventName].push(eventBin);
    },
    
    /**
     * 添加事件监听
     *
     * @param {String} eventName
     * @param {Function} handler
     * @param {Object} thisObject
     */
    on: function(eventName, handler, thisObject) {
        if(undefined === thisObject) {
            thisObject = null;
        }
        
        this.$insertEventBin(eventName, handler, thisObject);
    },
    
    /**
     * 移除事件处理器
     *
     * @param {String} eventName
     * @param {Function} handler
     * @param {Object} thisObject
     */
    off: function(eventName, handler, thisObject) {
        var map = this.$eventBinMap;
        
        if(undefined === map[eventName]) {
            return;
        }
        
        if(undefined === thisObject) {
            thisObject = null;
        }
        
        for(var i=0, len=map[eventName].length, bin=null; i<len; i++) {
            bin = map[eventName][i];
            
            if(thisObject === bin.thisObject && handler === bin.handler) {
                map[eventName].splice(i, 1);
                
                break;
            }
        }
    },
    
    /**
     * 派发事件
     *
     * @param {String} eventName
     * @param {any} data
     */
    fire: function(eventName, data) {
        var map = this.$eventBinMap;
        
        if(undefined === map[eventName]) {
            return;
        }
        
        for(var i=0, len=map[eventName].length, bin=null; i<len; i++) {
            bin = map[eventName][i];
            
            bin.handler.call(bin.thisObject, data);
        }
    }
};
