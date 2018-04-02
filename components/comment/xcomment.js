/**
 * 评论组件
 */
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
        
        // submit button
        this.submitButton = this.doc.createElement('button');
        this.submitButton.setAttribute('type', 'button');
        this.submitButton.className = 'xcomment-form-btn';
        this.submitButton.innerHTML = '发表评论';
        
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
        this.container.appendChild(this.submitButton);
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
    handlerWidgetClickEvent: function(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        
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
        
    }
};

XComment.editing = {
    // 记录光标位置
    currentRange: null
};

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
    this.button = button;
    
    this.onClick = function(xComment) {
        console.log(123)
    };
}
XComment.registerWidgetController('emoji', XCommentEmoji);