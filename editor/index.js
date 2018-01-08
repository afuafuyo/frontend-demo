/**
 * XEditor
 *
 * rich text editor for IE9+
 *
 * @author yu
 */
'use strict';

function XEditor(id, options) {
    this.id = id;
    this.doc = document;
    this.wrapper = null;
    this.widgetsWrapper = null;
    this.contentWrapper = null;
    this.root = null;
    this.events = {};
    this.fragment = this.doc.createDocumentFragment();
    
    this.defaultHtml = '<p><br></p>';
    
    this.widgetControllerInstances = {};
    // 假设同一时间只会有同一个类型的动作发生 所以所有动作共用一个定时器
    this.reactionTimer = 0;
    
    this.configs = {
        reactionTime: 200,
        widgets: ['code', '-', 'bold', 'blockquote', 'italic', '-', 'emotion', 'image', 'link'],
        placeholder: '',
        minHeight: '120',
        
        // upload url
        server: ''
    };
    
    this.init(options);
}
XEditor.prototype = {
    constructor: XEditor,
    extend: function(origin, configs) {
        if(undefined === configs) {
            return origin;
        }
        
        for(var k in configs) {
            origin[k] = configs[k];
        }
        
        return origin;
    },
    execCommand: function(aCommandName, aShowDefaultUI, aValueArgument) {
        XEditor.editing.execCommand(aCommandName, aShowDefaultUI, aValueArgument);
    },
    queryCommandState: function(command) {
        return XEditor.editing.queryCommandState(command);
    },
    clearElementContent: function(element) {
        while(null !== element.firstChild) {
            element.removeChild(element.firstChild);
        }
    },
    init: function(options) {
        if(undefined !== options) {
            this.extend(this.configs, options);
        }
        
        this.wrapper = this.doc.getElementById(this.id);
        this.wrapper.className = 'xeditor-wrapper';
        this.clearElementContent(this.wrapper);
        
        this.initWidgetsStructure();
        this.initContentStructure();
        this.render();
        
        this.initEvent();
        this.runPlugins();
        this.resetRangeAtEndElement();
        
        this.fireEvent('ready');
    },
    initWidgetsStructure: function() {
        this.widgetsWrapper = this.doc.createElement('div');
        this.widgetsWrapper.className = 'xeditor-widgets-wrapper';
        
        var item = null;
        for(var i=0, len=this.configs.widgets.length; i<len; i++) {
            if('-' === this.configs.widgets[i]) {
                item = this.doc.createElement('span');
                item.className = 'xeditor-widgets-separator';
                
            } else {
                item = this.doc.createElement('button');
                item.setAttribute('type', 'button');
                item.setAttribute('data-role', this.configs.widgets[i]);
                item.className = 'xeditor-icon xeditor-icon-' + this.configs.widgets[i];
            
                this.widgetControllerInstances[this.configs.widgets[i]] =
                    new XEditor.widgetControllers[this.configs.widgets[i]](item);
            }
            
            this.widgetsWrapper.appendChild(item);
        }
        
        this.fragment.appendChild(this.widgetsWrapper);
    },
    initContentStructure: function() {
        this.contentWrapper = this.doc.createElement('div');
        this.root = this.doc.createElement('div');
        
        this.contentWrapper.className = 'xeditor-content-wrapper';
        this.root.className = 'xeditor-content-root';
        this.root.contentEditable = true;
        this.root.setAttribute('spellcheck', false);
        this.root.style.minHeight = this.configs.minHeight + 'px';
        
        this.root.innerHTML = this.defaultHtml;
        
        this.contentWrapper.appendChild(this.root);
        this.fragment.appendChild(this.contentWrapper);
    },
    render: function() {
        this.wrapper.appendChild(this.fragment);
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
        
        // content
        this.root.onkeyup = function(e) {
            _self.handlerKeyupEvent(e);
        };
        
        this.root.onclick = function(e) {
            _self.handlerContentClickEvent(e);
        };
    },
    deleteEvent: function() {
        this.widgetsWrapper.onmousedown = null;
        this.widgetsWrapper.onclick = null;
        this.root.onkeyup = null;
        this.root.onclick = null;
    },
    runPlugins: function() {
        for(var name in XEditor.plugins) {
            XEditor.plugins[name](this);
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
    handlerKeyupEvent: function(e) {
        if(0 === this.root.innerHTML.length) {
            // setContent 会调用 saveCurrentRange
            // 但是每次按键弹起时不一定走这个逻辑
            // 所以下面还有一个 saveCurrentRange
            this.setContent('');
        }
        
        XEditor.editing.saveCurrentRange();
        
        this.changeWidgetsStatus();
    },
    handlerContentClickEvent: function(e) {
        var _self = this;
        
        clearTimeout(this.reactionTimer);
        this.reactionTimer = setTimeout(function(){            
            XEditor.editing.saveCurrentRange();
            
            _self.changeWidgetsStatus();
            
        }, this.configs.reactionTime);
    },
    changeWidgetsStatus: function() {
        for(var widget in this.widgetControllerInstances) {
            this.widgetControllerInstances[widget].changeStatus
                && this.widgetControllerInstances[widget].changeStatus(this);
        }
    },
    
    /**
     * 定位光标到内容最后一个节点
     *
     * @param {Boolean} toEnd 是否将光标定位到末尾
     */
    resetRangeAtEndElement: function(toEnd) {
        XEditor.editing.resetRangeAt(this.root.lastChild, toEnd);
    },
    /**
     * 获取内容
     */
    getContent: function() {
        return this.root.innerHTML.replace(/&#8203;/g, '');
    },
    /**
     * 设置内容
     *
     * @param {String} data
     */
    setContent: function(data) {
        this.root.innerHTML = '' === data
            ? this.defaultHtml
            : '<p>'+ data +'</p>';
        
        this.resetRangeAtEndElement();
    },
    /**
     * 获取纯文本内容
     */
    getPlainText: function() {
        return XEditor.tools.string
            .filterTags(this.root.innerHTML)
            .replace(/&#8203;/g, '');
    },
    /**
     * 销毁
     */
    destroy: function() {
        this.deleteEvent();
        
        this.clearElementContent(this.wrapper);
        
        this.wrapper = null;
        this.widgetsWrapper = null;
        this.contentWrapper = null;
        this.root = null;
    },
    fireEvent: function(eventName, data) {
        var handlersArray = this.events[eventName];
        
        if(undefined === handlersArray) {
            return;
        }
        
        for(var i=0, len=handlersArray.length; i<len; i++) {
            handlersArray[i](this, data);
        }
    },
    addEventListener: function(eventName, handler) {
        if(undefined === this.events[eventName]) {
            this.events[eventName] = [];
        }
        
        this.events[eventName].push(handler);
    },
    removeEventListener: function(eventName, handler) {
        if(undefined === this.events[eventName]) {
            return;
        }
        
        if(undefined === handler) {
            delete this.events[eventName];
            
        } else {
            for(let i=0,len=this.events[eventName].length; i<len; i++) {
                if(handler === this.events[eventName][i]) {
                    this.events[eventName].splice(i, 1);
                }
            }
        }
    }
};

/**
 * plugins 简单的插件
 *
 * {name: callback ...}
 *
 */
XEditor.plugins = {};

/**
 * 部件容器
 *
 * {name: Function ...}
 *
 */
XEditor.widgetControllers = {};
XEditor.registerWidgetController = function(name, processer) {
    XEditor.widgetControllers[name] = processer;
};

/**
 * 工具
 */
XEditor.tools = {
    string: {
        trimChar: function(str, character) {
            if(character === str.charAt(0)) {
                str = str.substring(1);
            }
            if(character === str.charAt(str.length - 1)) {
                str = str.substring(0, str.length - 1);
            }
            
            return str;
        },
        ucFirst: function(str) {
            var ret = str.charAt(0).toUpperCase();
            
            return ret + str.substring(1);
        },
        filterTags: function(str, allowed) {
            var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
            var comments = /<!--[\s\S]*?-->/gi;
            
            str = str.replace(comments, '');
            
            if(undefined === allowed) {
                return str.replace(tags, '');
            }
            
            allowed = allowed.toLowerCase();
            
            return str.replace(tags, function(match, p) {
                return allowed.indexOf('<' + p.toLowerCase() + '>') !== -1 ? match : '';
            });
        }
    },
    dom: {
        addClass: function(element, className) {
            if(-1 !== element.className.indexOf(className)) {
                return;
            }
            
            element.className = element.className + ' ' + className;
        },
        removeClass: function(element, className) {
            var newClassName =  ' ' + element.className + ' ';
            var replaced = newClassName.replace(' ' + className + ' ', ' ');
            
            element.className = XEditor.tools.string.trimChar(replaced, ' ');
        },
        preventDefault: function(event) {
            if(event.preventDefault) {
                event.preventDefault();
            
            } else {
                event.returnValue = false;
            }
        },
        setStyle: function(element, styles) {
            for(var s in styles) {
                element.style[s] = styles[s];
            }
        }
    }
};

/**
 * 对外 API - Selection & Range & execCommand
 */
XEditor.editing = {
    // 记录光标位置
    currentRange: null,
    saveCurrentRange: function(range) {
        if(undefined !== range) {
            XEditor.editing.currentRange = range;
            
            return;
        }
        
        var getRange = XEditor.Range.getSingleRangeFromNativeSelection();
        
        if(null !== getRange) {
            XEditor.editing.currentRange = getRange;
        }
    },
    resetRangeAt: function(node, toEnd) {
        var range = XEditor.Range.createNativeRange();
        
        if(null === range) {
            return;
        }
        
        if(true === toEnd) {
            var position = node.nodeType === 1
                ? node.childNodes.length : node.nodeValue.length;
            range.setStart(node, position);
            
        } else {
            range.setStart(node, 0);
        }
        
        // range.insertNode(document.createTextNode('|'));
        
        XEditor.editing.saveCurrentRange(new XEditor.Range(range));
        XEditor.editing.resumeSelection();
    },
    resumeSelection: function() {
        if(null === XEditor.editing.currentRange) {
            return;
        }
        
        var selection = window.getSelection();
        
        if(selection.rangeCount > 0) {
            selection.removeAllRanges();
        }
        
        selection.addRange(XEditor.editing.currentRange.nativeRange);
    },
    diffApi: {
        insertHTML: function(aShowDefaultUI, aValueArgument) {
            var doc = document;
            var range = XEditor.editing.currentRange;
            var tmpElement = null;
            
            if(null === range) {
                return;
            }
            
            if(doc.queryCommandSupported('insertHTML')) {
                doc.execCommand('insertHTML', aShowDefaultUI, aValueArgument);
            
                return;
            }
            
            // ie
            range.deleteContents();
            range.collapse();
            
            var p = range.getClosestContainerElement();
            p.innerHTML += aValueArgument;
        }
    },
    // https://w3c.github.io/editing/execCommand.html#methods-to-query-and-execute-commands
    execCommand: function(aCommandName, aShowDefaultUI, aValueArgument) {
        // 执行命令前 需要知道光标的位置
        XEditor.editing.resumeSelection();
        
        if(undefined !== XEditor.editing.diffApi[aCommandName]) {
            XEditor.editing.diffApi[aCommandName](
                aShowDefaultUI, aValueArgument);
            
            return;
        }
        
        document.execCommand(aCommandName, aShowDefaultUI, aValueArgument);
    },
    queryCommandState: function(command) {
        return document.queryCommandState(command);
    }
};
XEditor.Range = function(nativeRange) {
    this.nativeRange = nativeRange;
    
    this.collapsed = nativeRange.collapsed;
    this.startContainer = nativeRange.startContainer;
    this.endContainer = nativeRange.endContainer;
    this.startOffset = nativeRange.startOffset;
    this.endOffset = nativeRange.endOffset;
    this.commonAncestorContainer  = nativeRange.commonAncestorContainer ;
}
XEditor.Range.prototype = {
    constructor: XEditor.Range,
    getClosestContainerElement: function() {
        var ret = this.commonAncestorContainer;
        
        return 1 === ret.nodeType ? ret : ret.parentNode;
    },
    setStart: function(startNode, startOffset) {
        this.nativeRange.setStart(startNode, startOffset);
    },
    setEnd: function(endNode, endOffset) {
        this.nativeRange.setEnd(endNode, endOffset);
    },
    insertNode: function(newNode) {
        this.nativeRange.insertNode(newNode);
    },
    collapse: function(toStart) {
        this.nativeRange.collapse(toStart);
    },
    selectNode: function(referenceNode) {
        this.nativeRange.selectNode(referenceNode);
    },
    selectNodeContents: function(referenceNode) {
        this.nativeRange.selectNodeContents(referenceNode);
    },
    deleteContents: function() {
        this.nativeRange.deleteContents();
    }
};
XEditor.Range.getSingleRangeFromNativeSelection = function() {
    var selection = null;
    
    if('function' === typeof window.getSelection) {
        selection = window.getSelection();
        
        if(0 === selection.rangeCount) {
            return null;
        }
        
        return new XEditor.Range(selection.getRangeAt(0));
    }
    
    return null;
};
XEditor.Range.createNativeRange = function() {
    if('function' === typeof document.createRange) {
        return document.createRange();
    }
    
    return null;
};

/**
 * Dialog
 */
XEditor.Lock = function() {
    this.doc = document;
    this.zIndex = 1100;
    this.inited = false;
    this.mask = null;
    this.id = 'xeditor-dialog-mask';
};
XEditor.Lock.getInstance = function() {
    if(undefined === XEditor.Lock.instance) {
        XEditor.Lock.instance = new XEditor.Lock();
    }
    
    return XEditor.Lock.instance;
};
XEditor.Lock.prototype = {
    constructor : XEditor.Lock
    ,init : function(opacity) {
        if(this.inited) return;
        
        var _self = this;
        
        if(undefined === opacity) {
            opacity = 0.6;
        }
        
        this.mask = this.doc.createElement('div');
        this.mask.setAttribute('id', this.id);
        
        XEditor.tools.dom.setStyle(this.mask, {
            position: 'fixed',
            zIndex: this.zIndex,
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            backgroundColor: '#000',
            filter: 'alpha(opacity='+ (opacity * 100) +')',
            opacity: opacity
        });
        
        // close
        this.mask.onclick = function(e) {
            XEditor.Dialog.getInstance().close();
            _self.unLock();
        };
        
        this.inited = true;
    }
    
    ,unLock : function() {
        if(null !== this.doc.getElementById(this.id)) {
            this.doc.body.removeChild(this.mask);
        }
    }
    ,lock : function(opacity) {
        this.init(opacity);
        
        if(null === this.doc.getElementById(this.id)) {
            this.doc.body.appendChild(this.mask);
        }
    }
};
XEditor.Dialog = function() {
    this.doc = document;
    this.wrapper = null;
    this.closeButton = null;
    this.afterCloseCallback = null;
    this.timer = 0;
    this.zIndex = 1120;
    this.id = 'xeditor-dialog-dialog';
    
    this.inited = false;
};
XEditor.Dialog.getInstance = function() {
    if(undefined === XEditor.Dialog.instance) {
        XEditor.Dialog.instance = new XEditor.Dialog();
    }
    
    return XEditor.Dialog.instance;
};
XEditor.Dialog.prototype = {
    constructor: XEditor.Dialog,
    init : function() {
        if(this.inited) {
            return;
        }
        
        var _self = this;
                    
        this.wrapper = this.doc.createElement('div');
        this.wrapper.setAttribute('id', this.id);
        this.setStyle(this.wrapper, {
            position: 'fixed',
            zIndex: this.zIndex,
            top: '20%',
            width: '400px',
            fontSize: '14px',
            backgroundColor: '#fff',
            wordWrap: 'break-word',
            wordBreak: 'break-all',
            borderRadius: '4px',
            transition: 'opacity .5s linear'
        });
        
        this.closeButton = this.doc.createElement('span');
        this.closeButton.innerHTML = '&times;';
        this.setStyle(this.closeButton, {
            position: 'absolute',
            zIndex: this.zIndex,
            top: 0,
            right: '-30px',
            width: '26px',
            height: '26px',
            lineHeight: '26px',
            cursor: 'pointer',
            fontSize: '29px',
            color: '#fff'
        });
        this.closeButton.onclick = function(e) {
            _self.close();
            XEditor.Lock.getInstance().unLock();
        };
        
        this.inited = true;
    },
    resetPosition: function() {
        var width = this.wrapper.clientWidth;
        var winWidth = this.doc.body.clientWidth;
        
        this.wrapper.style.left = Math.floor((winWidth - width) / 2) + 'px';
    },
    setStyle: function(element, styles) {
        XEditor.tools.dom.setStyle(element, styles);
    },
    fadeIn: function() {
        this.wrapper.style.opacity = 1;
    },
    render: function() {
        XEditor.Lock.getInstance().lock();
        
        if(null === this.doc.getElementById(this.id)) {
            this.doc.body.appendChild(this.wrapper);
        }      
    },
    close: function() {
        if(null !== this.doc.getElementById(this.id)) {
            this.doc.body.removeChild(this.wrapper);
        }
        
        if(null !== this.afterCloseCallback) {
            this.afterCloseCallback();
        }
    },
    show: function(content, afterCloseCallback) {
        this.afterCloseCallback = null;
        
        if(undefined !== afterCloseCallback) {
            this.afterCloseCallback = afterCloseCallback
        }
        
        this.init();
        this.setStyle(this.wrapper, {opacity: 0});
        
        this.wrapper.innerHTML = content;
        this.wrapper.appendChild(this.closeButton);
        
        this.render();
        this.resetPosition();
        this.fadeIn();
    }
};


/**
 * bold
 */
function XEditorBold(button) {
    this.button = button;
}
XEditorBold.prototype = {
    constructor: XEditorBold,
    onClick: function(editor) {
        var range = XEditor.editing.currentRange;
        
        if(null === range) {
            return;
        }
        
        if(range.collapsed) {
            return;
        }
        editor.execCommand('bold', false, null);
        
        this.changeStatus(editor);
    },
    changeStatus: function(editor) {
        var ret = editor.queryCommandState('bold');
        if(true === ret) {
            XEditor.tools.dom.addClass(this.button, 'active');
            
            return;
        }
        
        XEditor.tools.dom.removeClass(this.button, 'active');
    }
};
XEditor.registerWidgetController('bold', XEditorBold);

/**
 * emotion
 */
function XEditorEmotion(button) {
    this.editor = null;
    this.html =
['<div class="xeditor-emotion-wrapper">',
    '<div class="xeditor-dialog-tabs">',
        '<a class="active" href="javascript:;">精选</a>',
    '</div>',
    '<div class="xeditor-emotion-content">',
        '<a class="xeditor-emotion-item" href="javascript:;" title="高兴" data-em="(^_^)">(^_^)</a>',
        '<a class="xeditor-emotion-item" href="javascript:;" title="难过" data-em="(＞﹏＜)">(＞﹏＜)</a>',
        '<a class="xeditor-emotion-item" href="javascript:;" title="哼" data-em="(￣ヘ￣o)">(￣ヘ￣o)</a>',
        '<a class="xeditor-emotion-item" href="javascript:;" title="哭" data-em="(╥﹏╥)">(╥﹏╥)</a>',
        '<a class="xeditor-emotion-item" href="javascript:;" title="害怕" data-em="o((⊙﹏⊙))o">o((⊙﹏⊙))o</a>',
        '<a class="xeditor-emotion-item" href="javascript:;" title="赞" data-em="d===(￣▽￣*)b">d===(￣▽￣*)b</a>',
        '<a class="xeditor-emotion-item" href="javascript:;" title="爱你" data-em="(づ￣3￣)づ╭❤">(づ￣3￣)づ╭❤</a>',
        '<a class="xeditor-emotion-item" href="javascript:;" title="害羞" data-em="(✿◡‿◡)">(✿◡‿◡)</a>',
        '<a class="xeditor-emotion-item" href="javascript:;" title="无奈" data-em="╮(╯＿╰)╭">╮(╯＿╰)╭</a>',
        '<a class="xeditor-emotion-item" href="javascript:;" title="惊讶" data-em="(⊙ˍ⊙)">(⊙ˍ⊙)</a>',
        '<a class="xeditor-emotion-item" href="javascript:;" title="汗" data-em="(-_-!)">(-_-!)</a>',
        '<a class="xeditor-emotion-item" href="javascript:;" title="加油" data-em="ᕦ(ò_óˇ)ᕤ">ᕦ(ò_óˇ)ᕤ</a>',
    '</div>',
'</div>'].join('');
}
XEditorEmotion.prototype = {
    constructor: XEditorEmotion,
    close: function() {
        XEditor.Lock.getInstance().unLock();
        XEditor.Dialog.getInstance().close();
    },
    bindEvent: function() {
        var _self = this;
        var wrap = this.editor.doc.querySelector('.xeditor-emotion-content');
        wrap.onclick = function(e) {
            e = e || window.event;
            var target = e.target || e.srcElement;
            
            var em = target.getAttribute('data-em');
            
            if(null !== em) {
                _self.editor.execCommand('insertHTML', false, em);
                
                _self.close();
            }
        };
        wrap = null;
    },
    onClick: function(editor) {
        this.editor = editor;
        
        var dialog = XEditor.Dialog.getInstance();
        dialog.show(this.html);
        
        this.bindEvent();
    }
};
XEditor.registerWidgetController('emotion', XEditorEmotion);

/**
 * link
 */
function XEditorLink(button) {
    this.button = button;
    this.editor = null;
    this.html =
['<div class="xeditor-link-wrapper">',
    '<div class="xeditor-link-title">',
        '<strong>插入链接</strong>',
    '</div>',
    '<div class="xeditor-link-content">',
        '<div class="xeditor-inputtext-wrapper"><input type="text" placeholder="输入链接文本 (可选)"></div>',
        '<div class="xeditor-inputtext-wrapper active"><input type="text" placeholder="输入链接地址"></div>',
    '</div>',
    '<div class="xeditor-dialog-footer">',
        '<button type="button" class="xeditor-btn xeditor-btn-primary" data-role="ok">插入图片</button>',
        '<span>&nbsp;</span>',
        '<button type="button" class="xeditor-btn" data-role="cancel">取消</button>',
    '</div>',
'</div>'].join('');
}
XEditorLink.prototype = {
    constructor: XEditorLink,
    getRangeElement: function() {
        var range = XEditor.editing.currentRange;
        var ret = null;
        
        if(null === range) {
            return null;
        }
        
        return range.getClosestContainerElement();
    },
    isLink: function(link) {
        return true;
    },
    close: function() {
        XEditor.Lock.getInstance().unLock();
        XEditor.Dialog.getInstance().close();
    },
    bindEvent: function() {
        var _self = this;
        var wrap = this.editor.doc.querySelector('.xeditor-link-wrapper');
        var inputItems = wrap.querySelectorAll('.xeditor-inputtext-wrapper');
        var inputs = wrap.querySelectorAll('input[type="text"]');
        
        wrap.onclick = function(e) {
            e = e || window.event;
            var target = e.target || e.srcElement;
            var nodeName = target.nodeName.toUpperCase();
            
            if('INPUT' === nodeName) {
                for(var i=0,len=inputItems.length; i<len; i++) {
                    XEditor.tools.dom.removeClass(inputItems[i], 'active');
                }
                
                XEditor.tools.dom.addClass(target.parentNode, 'active');
                
                return;
            }
            
            if('BUTTON' === nodeName) {
                if('cancel' === target.getAttribute('data-role')) {
                    _self.close();
                    
                    return;
                }
                
                if('ok' === target.getAttribute('data-role')) {
                    var text = inputs[0].value;
                    var link = inputs[1].value;
                    
                    if(!_self.isLink(link)) {
                        return;
                    }
                    
                    // 修改链接
                    if(_self.button.className.indexOf('active') > 0) {
                        var originA = _self.getRangeElement();
                        
                        originA.setAttribute('href', link);
                        originA.innerHTML = (text || link);
                        
                    } else {
                        _self.editor.execCommand('insertHTML', false,
                            '<a href="'+ link +'">'+ (text || link) +'</a>');
                        XEditor.editing.saveCurrentRange();
                    }
                    
                    _self.close();
                }
            }
        };
        wrap = null;
    },
    initContent: function() {
        if(this.button.className.indexOf('active') > 0) {
            var element = this.getRangeElement();
            var inputs = this.editor.doc.querySelectorAll('input[type="text"]');
            
            var link = element.getAttribute('href');
            var text = element.innerHTML;
            
            // link
            inputs[1].value = link;
            
            // text
            if(link !== text) {
                inputs[0].value = text;
            }
        }
    },
    autoFocus: function() {
        this.editor.doc.querySelectorAll('input[type="text"]')[1].focus();
    },
    onClick: function(editor) {
        this.editor = editor;
        
        var dialog = XEditor.Dialog.getInstance();
        dialog.show(this.html);
        
        this.bindEvent();
        
        this.initContent();
        
        this.autoFocus();
    },
    changeStatus: function(editor) {
        var element = this.getRangeElement();
        
        if(null === element) {
            return;
        }
                
        if('A' === element.nodeName.toUpperCase()) {
            XEditor.tools.dom.addClass(this.button, 'active');
            
            return;
        }
        
        XEditor.tools.dom.removeClass(this.button, 'active');
    }
};
XEditor.registerWidgetController('link', XEditorLink);

/**
 * image
 */
function XEditorImage(button) {
    this.button = button;
    this.editor = null;
    this.html =
['<div class="xeditor-uploadimage-wrapper">',
    '<div class="xeditor-dialog-tabs">',
        '<a class="active" href="javascript:;" data-role="local">本地图片</a>',
        '<a href="javascript:;" data-role="remote">网络图片</a>',
    '</div>',
    '<div class="xeditor-uploadimage-content xeditor-uploadimage-content-local">',
        '<div class="xeditor-uploadimage-uploadlist">',
        '</div>',
        '<div class="xeditor-uploadimage-uploadbtn">',
            '<input id="xeditor-uploadimage-inputfile" type="file" class="xeditor-uploadimage-input">',
        '</div>',
        '<div class="xeditor-clear"></div>',
    '</div>',
    '<div style="display:none" class="xeditor-uploadimage-content xeditor-uploadimage-content-remote">',
        '<div class="xeditor-inputtext-wrapper active">',
            '<input type="text" placeholder="图片地址">',
        '</div>',
        '<div class="xeditor-uploadimage-remote-preview"><img src=""></div>',
    '</div>',
    '<div class="xeditor-dialog-footer">',
        '<button type="button" class="xeditor-btn xeditor-btn-primary" data-role="ok">插入图片</button>',
        '<span>&nbsp;</span>',
        '<button type="button" class="xeditor-btn" data-role="cancel">取消</button>',
    '</div>',
'</div>'].join('');

    this.defaultImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAoCAMAAAA/pq9xAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAzUExURUdwTFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUAdKVl8AAAAQdFJOUwAwzyAQYO9/v0Cfj3BQr9/suovOAAABcklEQVRIx+2Vy5KsIBAFEwGKQtTz/197F0q3fWfVxETMxlwYbCQp6gE8PDw8/BWeoAaI1X9px7XWWmvNdRCQgxza8dLaB/lbSTYzK8XN7DjMzOKQRF04pnpn/T6WRC8BYLl+viR18ZOECdKIaua+bOnaANB2l5jC3q4dTbgyAEE2Y9nVgXE3dkm2w/CmI18SmgxIZUkzkrQYoO7u7oudlSVPALGpXhK6GmkpM46RXDlWoRoQ/EYYErL2/cze103hrr4p3CVVb4yXhKyRtolgfBMfEgOixbEckibNZQSQt/2nxBU+Jakp52mLnIScvd0lXf4hSYsyTFvk56f0u6QWncsEJkIpG0DWnOU8cuiqkTVfkqxVwJpRx5TKqKs8V2BygFD2pfTXHFBzAeByTIT0HkMzzSg/d4VVewKiHbIr85ji/wOyfj1U6lEi+dAKsJWSbFFZI7CcndJ+jHqbGPUR8nifQmZbt3ejusfnFX94ePg7/gGnExM5f+TplgAAAABJRU5ErkJggg==';

    this.uploader = null;
}
XEditorImage.prototype = {
    constructor: XEditorImage,
    close: function() {
        XEditor.Lock.getInstance().unLock();
        XEditor.Dialog.getInstance().close();
    },
    bindEvent: function() {
        var _self = this;
        var wrapper = this.editor.doc.querySelector('.xeditor-uploadimage-wrapper');
        var contents = wrapper.querySelectorAll('.xeditor-uploadimage-content');
        var imageListWrapper = wrapper.querySelector('.xeditor-uploadimage-uploadlist');
        var remoteImageInput = wrapper.querySelector('input[type="text"]');
        var previewBox = remoteImageInput.parentNode.nextSibling;
        
        // 默认图
        previewBox.firstChild.src = this.defaultImage;
        
        // tab 切换 确定取消 删除图片
        wrapper.onclick = function(e) {
            e = e || window.event;
            
            var target = e.target || e.srcElement;
            var role = target.getAttribute('data-role');
            
            if(null === role) {
                return;
            }
            
            if('local' === role || 'remote' === role) {
                var tabs = target.parentNode.querySelectorAll('a');
                
                for(var i=0,len=contents.length; i<len; i++) {
                    contents[i].style.display = 'none';
                }
                for(var i=0,len=tabs.length; i<len; i++) {
                    tabs[i].className = '';
                }
                
                contents['local' === role ? 0 : 1].style.display = 'block';
                target.className = 'active';
                
                return;
            }
            
            if('del' === role) {
                target.parentNode.parentNode.removeChild(target.parentNode);
                
                return;
            }
            
            if('cancel' === role) {
                _self.close();
                
                return;
            }
            
            if('ok' === role) {
                var images = imageListWrapper.querySelectorAll('img');
                
                var ret = '';
                
                var firstTab = wrapper.querySelector('a');
                
                // 添加图片
                if(firstTab.className.indexOf('active') >= 0) {
                    for(var i=0,len=images.length; i<len; i++) {
                        ret += '<p><img src="'+ images[i].src +'"></p>';
                    }
                    
                } else {
                    ret = '<p><img src="'+ remoteImageInput.value +'"></p>';
                }
                
                if('' !== ret) {
                    _self.editor.execCommand('insertHTML', false, ret);
                }
                
                _self.close();
            }
        };
    
        // 远程图片
        remoteImageInput.onkeyup = function(e) {
            var value = this.value;
            
            previewBox.firstChild.src = '' === value ? _self.defaultImage : value;
        };
    },
    onClick: function(editor) {
        this.editor = editor;
        
        var dialog = XEditor.Dialog.getInstance();
        dialog.show(this.html);
        
        this.bindEvent();
        
        this.initUpload();
    },
    initUpload: function() {
        if(undefined === window.XEditorFileUpload) {
            return;
        }
        
        var _self = this;
        
        this.uploader = new XEditorFileUpload('xeditor-uploadimage-inputfile', {
            server: this.editor.configs.server
        });
        
        this.uploader.fileQueuedHandler = function(file) {
            _self.renderProgressView(file);
        };
        this.uploader.filesQueuedCompleteHandler = function(obj) {
            // todo some other things
            _self.uploader.startUpload();
        };
        this.uploader.uploadProgressHandler = function(file, percent) {
            var wrapper = _self.editor.doc.getElementById(file.id);
            
            wrapper.firstChild.firstChild.style.width = percent * 100 + '%';
        };
        this.uploader.uploadSuccessHandler = function(file, serverData) {
            //console.log(serverData);
            var data = JSON.parse(serverData);
            
            _self.renderImageView(file, data);
        };
        this.uploader.uploadCompleteHandler = function() {
            //console.log('done');
        };
    },
    renderProgressView: function(file) {
        /*
        <div class="xeditor-uploadimage-imageitem">
            <span class="xeditor-uploadimage-progress">
                <span class="xeditor-uploadimage-percent"></span>
            </span>
        </div>
        */
        
        var doc = this.editor.doc;
        var wrapper = doc.querySelector('.xeditor-uploadimage-wrapper');
        var listWrapper = wrapper.querySelector('.xeditor-uploadimage-uploadlist');
        
        var div = doc.createElement('div');
        div.className = 'xeditor-uploadimage-imageitem';
        div.id = file.id;
        div.innerHTML = '<span class="xeditor-uploadimage-progress">'
            + '<span class="xeditor-uploadimage-percent"></span>'
            + '</span>';
        
        listWrapper.appendChild(div);
    },
    renderImageView: function(file, data) {
        /*
        <div class="xeditor-uploadimage-imageitem">
            <a href="javascript:;" class="xeditor-uploadimage-delete">&times;</a>
            <img src="">
        </div>
        */
        
        var doc = this.editor.doc;
        var wrapper = doc.querySelector('.xeditor-uploadimage-wrapper');
        var listWrapper = wrapper.querySelector('.xeditor-uploadimage-uploadlist');
        
        var old = doc.getElementById(file.id);
        var div = doc.createElement('div');
        div.className = 'xeditor-uploadimage-imageitem';
        div.innerHTML = '<a data-role="del" href="javascript:;" class="xeditor-uploadimage-delete">&times;</a>'
            + '<img src="'+ data.data +'">';
        
        listWrapper.insertBefore(div, old);
        listWrapper.removeChild(old);
    },
};
XEditor.registerWidgetController('image', XEditorImage);

/**
 * blockquote
 */
function XEditorBlockQuote(button) {
    this.button = button;
}
XEditorBlockQuote.prototype = {
    constructor: XEditorBlockQuote,
    onClick: function(editor) {
        var range = XEditor.editing.currentRange;

        if(null === range) {
            return;
        }

        var container = range.getClosestContainerElement();
        var html = container.innerHTML;
        var node = null;

        if('BLOCKQUOTE' !== container.nodeName.toUpperCase()) {
            node = editor.doc.createElement('blockquote');
        } else {
            node = editor.doc.createElement('p');
        }

        node.innerHTML = html;
        container.parentNode.replaceChild(node, container);
        
        XEditor.editing.resetRangeAt(node, true);
        
        this.changeStatus(editor);
    },
    changeStatus: function(editor) {
        var range = XEditor.editing.currentRange;
        
        if(null === range) {
            return;
        }
        
        var container = range.getClosestContainerElement();
        var blocked = false;
        
        while(-1 === container.className.indexOf('xeditor-content-root')) {
            if('BLOCKQUOTE' === container.nodeName.toUpperCase()) {
                blocked = true;
                
                break;
            }
            
            container = container.parentNode;
        }
        
        if(blocked) {
            XEditor.tools.dom.addClass(this.button, 'active');
            
        } else {
            XEditor.tools.dom.removeClass(this.button, 'active');
        }
    }
};
XEditor.registerWidgetController('blockquote', XEditorBlockQuote);

/**
 * italic
 */
function XEditorItalic(button) {
    this.button = button;
}
XEditorItalic.prototype = {
    constructor: XEditorItalic,
    onClick: function(editor) {
        var range = XEditor.editing.currentRange;

        if(null === range) {
            return;
        }

        if(range.collapsed) {
            return;
        }
        editor.execCommand('italic', false, null);
        
        this.changeStatus(editor);
    },
    changeStatus: function(editor) {
        var ret = editor.queryCommandState('italic');
        if(true === ret) {
            XEditor.tools.dom.addClass(this.button, 'active');
            
            return;
        }
        
        XEditor.tools.dom.removeClass(this.button, 'active');
    }
};
XEditor.registerWidgetController('italic', XEditorItalic);

/**
 * code
 */
function XEditorCode(button) {
    this.button = button;
}
XEditorCode.prototype = {
    constructor: XEditorCode,
    onClick: function(editor) {
        var range = XEditor.editing.currentRange;

        if(null === range) {
            return;
        }

        var pre = editor.doc.createElement('pre');
        pre.appendChild(editor.doc.createElement('br'));
        range.insertNode(pre);
        
        XEditor.editing.resetRangeAt(pre);
        
        this.changeStatus(editor);
    },
    changeStatus: function(editor) {
        var range = XEditor.editing.currentRange;
        
        if(null === range) {
            return;
        }
        
        var container = range.getClosestContainerElement();
        var blocked = false;
        
        while(-1 === container.className.indexOf('xeditor-content-root')) {
            if('PRE' === container.nodeName.toUpperCase()) {
                blocked = true;
                
                break;
            }
            
            container = container.parentNode;
        }
        
        if(blocked) {
            XEditor.tools.dom.addClass(this.button, 'active');
            
        } else {
            XEditor.tools.dom.removeClass(this.button, 'active');
        }
    }
};
XEditor.registerWidgetController('code', XEditorCode);