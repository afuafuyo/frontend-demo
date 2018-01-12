/**
 * tab 切换
 */
function YTab(oldClassName, activeClassName) {
    this.oldClassName = oldClassName;
    this.activeClassName = activeClassName;
    this.tabIndex = 0;
    this.callback = null;
    this.handlers = null;  // Array
    this.showAreas = null;  // Array
}
YTab.prototype = {
    constructor : YTab
    ,clearAllBg : function() {
        var len = this.handlers.length;
        for(var i=0; i<len; i++) {
            this.handlers[i].className = this.oldClassName;
        }
    }
    ,closeAllAreas : function() {
        var len = this.showAreas.length;
        for(var i=0; i<len; i++) {
            this.showAreas[i].style.display = 'none';
        }
    }
    ,openNowArea : function() {
        // 找出现在是第几个
        var len =  this.handlers.length;
        for(var i=0; i<len; i++) {
            if(this.activeClassName === this.handlers[i].className) {
                this.tabIndex = i;
                break;
            }
        }
        this.showAreas[this.tabIndex].style.display = 'block';
    }
    ,start : function() {
        var _self = this;
        var len = this.handlers.length;
        for(var i=0; i<len; i++) {
            this.handlers[i].onclick = function(e) {
                // 清除所有背景色
                _self.clearAllBg();
                // 当前背景色
                this.className = _self.activeClassName;
                // 关闭所有显示区域
                _self.closeAllAreas();
                // 打开当前区域
                _self.openNowArea();
                
                null !== _self.callback && (_self.callback(_self.tabIndex));
            };
        }
    }
    ,init : function(handlers, showAreas) {
        this.handlers = handlers;
        this.showAreas = showAreas;
        
        if(handlers.length === showAreas.length) {
            this.start();
        }
    }
};