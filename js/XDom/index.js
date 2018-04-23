'use strict';

/**
 * Html 转 Dom
 *
 * @author afu
 */
function XDom() {
    this.doc = document;
    this.wrapper = null;
    this.dom = null;
    this.lookingBackTagstack = new XDom.Stack();
    
    // <(xxx)( data-name="lisi") xxx (/)>
    // </(xxx)>
    // <!--(xxx)-->
    // 此正则有五个子模式
    // 1. 代表开始标签名称
    // 2. 代表整个属性部分
    // 3. 自闭合标签斜线
    // 4. 代表结束标签名称
    // 5. 代表注释内容
    this.htmlPartsRegex = /<(?:(?:(\w+)((?:\s+[\w\-:]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)[\S\s]*?(\/?)>)|(?:\/([^>]+)>)|(?:!--([\S|\s]*?)-->))/g;
    
    // (title)="()"
    this.attributesRegex = /([\w\-:]+)\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^>\s]+))/g;
}
XDom.prototype = {
    constructor: XDom,
    onText: function(text) {
        var node = this.doc.createTextNode(text);
        
        this.lookingBackTagstack.tail().appendChild(node);
    },
    onClose: function(tagName) {
        tagName = tagName.toLowerCase();
        
        this.dom = this.lookingBackTagstack.pop()
    },
    onOpen: function(tagName, attributes) {
        tagName = tagName.toLowerCase();
        
        var isSelfClosingTag = 1 === XDom.selfClosingTags[tagName];
        var node = this.doc.createElement(tagName);
        for(var k in attributes) {
            node.setAttribute(k, attributes[k]);
        }
        
        if(null !== this.lookingBackTagstack.tail()
                && node !== this.lookingBackTagstack.tail()) {
            this.lookingBackTagstack.tail().appendChild(node);
        }
        
        if(!isSelfClosingTag) {
            this.lookingBackTagstack.push(node);
        }
    },
    onComment: function(content) {
        var node = this.doc.createComment(content);
        
        this.lookingBackTagstack.tail().appendChild(node);
    },
    /**
     * 解析 html
     *
     * @param {String} html
     */
    parse: function(html) {
        if(0 !== html.indexOf('<')) {
            throw new Error('The html must startsWith normal tag');
        }
        
        var parts = null;
        // the index at which to start the next match
        var lastIndex = 0;
        var tagName = '';
        
        while( null !== (parts = this.htmlPartsRegex.exec(html)) ) {
            // TextNode
            if(parts.index > lastIndex) {
                var text = html.substring( lastIndex, parts.index );
                
                this.onText(text);
            }
            lastIndex = this.htmlPartsRegex.lastIndex;
                        
            // closing tag
            if( (tagName = parts[4]) ) {
                this.onClose(tagName);
                
                continue;
            }
            
            // opening tag & selfClosingTag
            if( (tagName = parts[1]) ) {
                
                var attrParts = null;
                var attrs = {};
                
                // attributes
                if(parts[2]) {
                    while ( null !== ( attrParts = this.attributesRegex.exec(parts[2]) ) ) {
                        var attrName = attrParts[1];
                        var attrValue = attrParts[2] || attrParts[3] || attrParts[4] || '';
                        
                        if(XDom.emptyAttributes[attrName]) {
                            attrs[attrName] = attrName;
                            
                        } else {
                            attrs[attrName] = attrValue;
                        }
                    }
                }
                
                this.onOpen(tagName, attrs);
                
                continue;
            }
            
            // comment
            if( (tagName = parts[5]) ) {
                this.onComment(tagName);
            }
        }
    },
    /**
     * 获取 dom
     */
    getDom: function() {
        return this.dom;
    }
};
XDom.selfClosingTags = {
    hr: 1,
    br: 1,
    col: 1,
    img: 1,
    textarea: 1,
    input: 1,
    embed: 1
};
XDom.emptyAttributes = {
    checked: 1,
    compact: 1,
    declare: 1,
    defer: 1,
    disabled: 1,
    ismap: 1,
    multiple: 1,
    nohref: 1,
    noresize: 1,
    noshade: 1,
    nowrap: 1,
    readonly: 1,
    selected: 1
};

/**
 * Stack
 */
XDom.Stack = function() {
    this.headNode = null;
    this.tailNode = null;
    this.size = 0;
}
XDom.Stack.prototype.push = function(data){
    var node = new XDom.StackNode(data, null, null);

    if(0 === this.size) {
        this.headNode = node;

    } else {
        this.tailNode.next = node;
        node.prev = this.tailNode;
    }

    this.tailNode = node;

    this.size++;
};
XDom.Stack.prototype.pop = function(){
    var ret = this.tailNode.data;
    
    if(0 === this.size) {
        return null;
    }
    if(1 === this.size) {
        this.headNode = this.tailNode = null;
        this.size--;
        
        return ret;
    }
    
    this.tailNode = this.tailNode.prev;
    this.tailNode.next.prev = null;
    this.tailNode.next = null;
    this.size--;
    
    return ret;
};
XDom.Stack.prototype.tail = function() {
    return null === this.tailNode ? null : this.tailNode.data;
};
XDom.Stack.prototype.clear = function() {
    while(0 !== this.size) {
        this.pop();
    }
};
XDom.Stack.prototype.toString = function() {
    var str = '[ ';

    for(var current = this.headNode; null !== current; current = current.next) {
        str += current.data + ' ';
    }

    return str + ' ]';
};
XDom.StackNode = function(data, prev, next) {
    this.data = data;
    this.prev = prev;
    this.next = next;
};
