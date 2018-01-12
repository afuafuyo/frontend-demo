/**
 * Event 工具
 */
var EventUtil = {
    
    /**
     * 添加事件处理器
     *
     * @param {Element} element
     * @param {String} type
     * @param {Function} handler
     */
    addHandler: function(element, type, handler) {
        if(element.addEventListener) {
            element.addEventListener(type, handler, false);
        
        } else if(element.attachEvent) {
            element.attachEvent('on' + type, handler);
        
        } else {
            element['on' + type] = handler;
        }
    },
    
    /**
     * 移除事件处理器
     *
     * @param {Element} element
     * @param {String} type
     * @param {Function} handler
     */
    removeHandler: function(element, type, handler) {
        if(element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        
        } else if(element.detachEvent) {
            element.detachEvent('on' + type, handler);
        
        } else {
            element['on' + type] = null;
        }
    },
    
    /**
     * 获取事件对象
     *
     * @param {Event} event
     */
    getEvent: function(event) {
        return event ? event : window.event;
    },
    
    /**
     * 获取事件源对象
     *
     * @param {Event} event
     */
    getTarget: function(event) {
        return event.target || event.srcElement;
    },
    
    /**
     * 阻止事件传播
     *
     * @param {Event} event
     */
    stopPropagation: function(event) {
        if(event.stopPropagation) {
            event.stopPropagation();
        
        } else {
            event.cancelBubble = true;
        }
    },
    
    /**
     * 取消某事件 不阻止事件传播
     *
     * @param {Event} event
     */
    preventDefault: function(event) {
        if(event.preventDefault) {
            event.preventDefault();
        
        } else {
            event.returnValue = false;
        }
    }
};