var XEvent = function() {
    /**
     * {
     *    'click': [
     *      {
     *        target: 'Element',
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
     * @param {Element} target
     * @param {String} type
     * @param {Function} handler
     * @param {Object} thisObject
     */
    $insertEventBin: function(target, type, handler, thisObject) {
        var map = this.$eventBinMap;
        
        if(undefined === map[type]) {
            map[type] = [];
        }
        
        var eventBin = {
            target: target,
            type: type,
            handler: handler,
            thisObject: thisObject
        };
        
        map[type].push(eventBin);
    },
    
    /**
     * 事件代理
     *
     * @param {Event} e
     */
    $eventProxy: function(e) {
        var target = e.target;
        var type = e.type;
        var map = this.$eventBinMap;
        
        if(undefined === map[type]) {
            return;
        }
        
        for(var i=0, len=map[type].length; i<len; i++) {
            if(target === map[type][i].target) {
                map[type][i].handler.call(map[type][i].thisObject, e);
                
                break;
            }
        }
    },
    
    /**
     * 添加事件监听
     *
     * @param {Element} element
     * @param {String} type
     * @param {Function} handler
     * @param {Object} thisObject
     */
    addEventListener: function(element, type, handler, thisObject) {
        var _self = this;
        
        if(undefined === thisObject) {
            thisObject = null;
        }
        
        // 避免重复绑定事件
        if(undefined === this.$eventBinMap[type]) {
            // Listen the specified event
            document.body.addEventListener(type, function(e) {
                _self.$eventProxy(e);
            }, false);
        }
        
        this.$insertEventBin(element, type, handler, thisObject);
    },
    
    /**
     * 移除事件处理器
     *
     * @param {Element} element
     * @param {String} type
     * @param {Function} handler
     */
    removeEventListener: function(element, type, handler) {
        var map = this.$eventBinMap;
        
        if(undefined === map[type]) {
            return;
        }
        
        for(var i=0, len=map[type].length; i<len; i++) {
            if(element === map[type][i].target && handler === map[type][i].handler) {
                map[type].splice(i, 1);
                
                break;
            }
        }
    }
};
