/**
 * 评论组件
 */
'use strict';

function XComment(options) {
    this.doc = document;
    this.container = null;
    this.submitButton = null;
    this.faceWrapper = null;
    this.contentWrapper = null;
    this.textArea = null;
    this.widgetsWrapper = null;
    this.widgetControllerInstances = {};
    
    this.configs = {
        onSubmit: function() {},
        widgets: [{
            name: 'emoji',
            text: '表情'
        }],
        placeholder: '请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。',
        avatar: 'https://i2.hdslb.com/bfs/face/b001dcba7b7d0de387abb9adefe4e409ba9e03f4.jpg@52w_52h.webp'
    };
    this.init(options);
}
XComment.prototype = {
    constructor: XComment,
    extend: function(origin, configs) {
        if(undefined === configs) {
            return origin;
        }
        
        for(var k in configs) {
            origin[k] = configs[k];
        }
        
        return origin;
    },
    init: function(options) {
        if(undefined !== options) {
            this.extend(this.configs, options);
        }
        
        // container
        this.container = this.doc.createElement('div');
        this.container.className = 'xcomment-relative xcomment-form';
                
        // face
        this.faceWrapper = this.doc.createElement('section');
        this.faceWrapper.className = 'xcomment-form-face';
        this.faceWrapper.innerHTML = '<img class="xcomment-form-avatar" src="'+ this.configs.avatar +'">';
        
        // content
        this.initContentStructure();
        
        // widgets
        this.initWidgetsStructure();
        
        // bind event
        this.initEvent();
        
        // combine
        this.container.appendChild(this.faceWrapper);
        this.container.appendChild(this.contentWrapper);
        this.container.appendChild(this.widgetsWrapper);
    },
    initContentStructure: function() {
        this.contentWrapper = this.doc.createElement('section');
        this.contentWrapper.className = 'xcomment-form-content';
        
        this.textArea = this.doc.createElement('textarea');
        this.textArea.setAttribute('placeholder', this.configs.placeholder);
        this.textArea.className = 'xcomment-form-textarea';
        
        this.contentWrapper.appendChild(this.textArea);
    },
    initWidgetsStructure: function() {
        this.widgetsWrapper = this.doc.createElement('section');
        this.widgetsWrapper.className = 'xcomment-form-widget';
        
        // submit button
        this.submitButton = this.doc.createElement('button');
        this.submitButton.setAttribute('type', 'button');
        this.submitButton.className = 'xcomment-form-btn';
        this.submitButton.innerHTML = '发表评论';
        this.widgetsWrapper.appendChild(this.submitButton);
        
        var item = null;
        for(var i=0, len=this.configs.widgets.length; i<len; i++) {
            item = this.doc.createElement('button');
            item.setAttribute('type', 'button');
            item.setAttribute('data-role', this.configs.widgets[i].name);
            item.className = 'xcomment-form-widget-item xcomment-form-widget-' + this.configs.widgets[i].name;
            item.innerHTML = this.configs.widgets[i].text;
            
            this.widgetControllerInstances[this.configs.widgets[i].name] =
                new XComment.widgetControllers[this.configs.widgets[i].name](item);
            
            
            this.widgetsWrapper.appendChild(item);
        }
        item = null;
    },
    initEvent: function() {
        var _self = this;
        
        // widgets
        this.widgetsWrapper.onmousedown = function() {
            return false;
        };
        this.widgetsWrapper.onclick = function(e) {
            _self.handlerWidgetClickEvent(e);
        };
        
        this.submitButton.onclick = function() {
            _self.configs.onSubmit(_self.getValue());
        }
    },
    deleteEvent: function() {
        this.widgetsWrapper.onmousedown = null;
        this.widgetsWrapper.onclick = null;
        this.submitButton.onclick = null;
    },
    handlerWidgetClickEvent: function(e) {
        var target = e.target;
        
        var role = target.getAttribute('data-role');
        
        // 只有触发事件的对象才处理
        if(null === role) {
            return;
        }
        
        if(undefined === this.widgetControllerInstances[role]) {
            return;
        }
        
        if(undefined === this.widgetControllerInstances[role].onClick) {
            throw new Error('The widget: '+ role +' has no onClick method');
        }
        
        this.widgetControllerInstances[role].onClick(this);
    },
    
    /**
     * 获取 dom 对象
     */
    getDom: function() {
        return this.container;
    },
    clear: function() {
        this.textArea.value = '';
    },
    getValue: function() {
        return this.textArea.value;
    },
    destroy: function() {
        this.deleteEvent();
        
        this.widgetsWrapper = null;
        this.contentWrapper = null;
        this.faceWrapper = null;
        this.container = null;
        
        for(var widget in this.widgetControllerInstances) {
            if(undefined !== this.widgetControllerInstances[widget].destroy) {
                this.widgetControllerInstances[widget].destroy();
            }
        }
    }
};

/**
 * Event
 */
XComment.event = (function() {

var XEvent = function() {
    /**
     * {
     *    'click': [
     *      {
     *        target: 'xxx',
     *        type: 'click',
     *        handler: 'xxx',
     *        thisObject: 'xxx'
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
        
        this.$insertEventBin(element, type, handler, thisObject);
        
        // Listen the specified event
        element.addEventListener(type, function(e) {
            _self.$eventProxy(e);
        }, false);
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

return new XEvent();

})();

/**
 * 部件容器
 *
 * {name: Function ...}
 *
 */
XComment.widgetControllers = {};
XComment.registerWidgetController = function(name, processer) {
    XComment.widgetControllers[name] = processer;
};

/**
 * emoji widget
 */
function XCommentEmoji(button) {
    this.xComment = null;
    this.button = button;    
    this.pop = null;
    this.closed = true;
    
    this.init = function() {
        this.pop = document.createElement('div');
        this.pop.className = 'xcomment-form-pop';
        this.pop.innerHTML =
'<div class="xcomment-form-pop-title">标题</div>' +
'<div class="xcomment-form-pop-emoji">' +
    '<a href="javascript:;" data-role="em" title="舒服" data-em="(￣▽￣)">(￣▽￣)</a>' +
    '<a href="javascript:;" data-role="em" title="高兴" data-em="(^_^)">(^_^)</a>' +
    '<a href="javascript:;" data-role="em" title="难过" data-em="(＞﹏＜)">(＞﹏＜)</a>' +
    '<a href="javascript:;" data-role="em" title="哼" data-em="(￣ヘ￣)">(￣ヘ￣)</a>' +
    '<a href="javascript:;" data-role="em" title="哭" data-em="(╥﹏╥)">(╥﹏╥)</a>' +
    '<a href="javascript:;" data-role="em" title="害怕" data-em="o((⊙﹏⊙))o">o((⊙﹏⊙))o</a>' +
    '<a href="javascript:;" data-role="em" title="赞" data-em="d===(￣▽￣*)b">d===(￣▽￣*)b</a>' +
    '<a href="javascript:;" data-role="em" title="爱你" data-em="(づ￣3￣)づ╭❤">(づ￣3￣)づ╭❤</a>' +
    '<a href="javascript:;" data-role="em" title="无奈" data-em="╮(╯＿╰)╭">╮(╯＿╰)╭</a>' +
    '<a href="javascript:;" data-role="em" title="惊讶" data-em="(⊙ˍ⊙)">(⊙ˍ⊙)</a>' +
    '<a href="javascript:;" data-role="em" title="汗" data-em="(-_-!)">(-_-!)</a>' +
    '<a href="javascript:;" data-role="em" title="强壮" data-em="ᕦ(ò_óˇ)ᕤ">ᕦ(ò_óˇ)ᕤ</a>' +
    '<a href="javascript:;" data-role="em" title="鄙视" data-em="→_→">→_→</a>' +
    '<a href="javascript:;" data-role="em" title="鄙视" data-em="←_←">←_←</a>' +
'</div>' +
'<div class="xcomment-form-pop-footer">' +
    '<a href="javascript:;" class="active">颜文字</a>' +
'</div>';

        var _self = this;
        this.pop.onclick = function(e) {
            _self.handlerPopClick(e);
        };
        
        XComment.event.addEventListener(document.body, 'click', function(e){
            _self.handlerPopClose(e);
        });
    };
    
    this.handlerPopClick = function(e) {
        var target = e.target;
        var role = target.getAttribute('data-role');
        
        var start = this.xComment.textArea.selectionStart;
        var end = this.xComment.textArea.selectionEnd;
        var value = this.xComment.textArea.value;
        
        // emoji
        if(null !== role && 'em' === role) {
            if('' === value) {
                this.xComment.textArea.value = target.getAttribute('data-em');
                
                return;
            }
            
            this.xComment.textArea.value = value.substring(0, start)
                + target.getAttribute('data-em')
                + value.substring(end);
        }
    };
    
    this.handlerPopClose = function(e) {        
        if(this.closed) {
            return;
        }
        
        var target = e.target;
        var shouldClose = true;
        
        while(null !== target && 'BODY' !== target.nodeName.toUpperCase()) {
            if('xcomment-form-widget' === target.className) {
                shouldClose = false;
                
                break;
            }
            
            target = target.parentNode;
        }
                    
        if(shouldClose) {
            this.destroy();
        }
    };
    
    this.destroy = function() {
        if(null !== this.xComment.widgetsWrapper.querySelector('.xcomment-form-pop')) {
            this.xComment.widgetsWrapper.removeChild(this.pop);
        }
        
        this.closed = true;
    };
    
    this.render = function() {
        this.xComment.widgetsWrapper.appendChild(this.pop);
        
        this.closed = false;
    };
    
    this.onClick = function(xComment) {
        this.xComment = xComment;
        
        if(null === this.pop) {
            this.init();
        }
        
        this.render();
        this.xComment.textArea.focus();
    };
}
XComment.registerWidgetController('emoji', XCommentEmoji);
