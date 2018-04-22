'use strict';

/**
 * Html 转 Dom
 *
 * @author afu
 */
function XDom() {
    this.doc = document;
    this.wrapper = null;
    this.stack = new XDom.Stack();
    
    // <(xxx)( data-name="lisi") xxx (/)>
    // </(xxx)>
    // <!--(xxx)-->
    // 此正则有五个子模式
    // 1. 代表开始标签名称
    // 2. 代表整个属性部分
    // 3. 自闭合标签斜线
    // 4. 代表闭合标签名称
    // 5. 代表注释内容
    //                                 |------------------- attrName=attribute value ------------------|
    this.htmlPartsRegex = /<(?:(?:(\w+)((?:\s+[\w\-:]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)[\S\s]*?(\/?)>)|(?:\/([^>]+)>)|(?:!--([\S|\s]*?)-->))/g;
    
    // (title)="()"
    this.attributesRegex = /([\w\-:]+)\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^>\s]+))/g;
}
XDom.prototype = {
    constructor: XDom,
    describe: function(nodeName, props, children) {},
    parse: function(html) {
        if(0 !== html.indexOf('<')) {
            throw new Error('The html must startsWith normal tag');
        }
        
        var parts = null;
        var currentLookbackTag = '';
        // the index at which to start the next match
        var lastIndex = 0;
        var tagName = '';
        
        // 全局模式可以循环查找字符串
        while( null !== (parts = this.htmlPartsRegex.exec(html)) ) {            
            // 自闭合标签 文本 评论 入栈
            // 开始标签记录 并 入栈
            
            // TextNode
            if(parts.index > lastIndex) {
                var text = html.substring( lastIndex, parts.index );
                this.stack.push(text);
            }
            lastIndex = this.htmlPartsRegex.lastIndex;
            
            // 开始标签
            if( (tagName = parts[3]) ) {
                tagName = tagName.toLowerCase();
                
                if(null === this.wrapper) {
                    this.wrapper = this.doc.createElement(tagName);
                    
                } else {
                    this.wrapper.appendChild(this.doc.createElement(tagName));
                }
                
                
                var arrtMatch = null;
                var attributeParts = parts[4];
                
                if(attributeParts) {
                    
                }
            }
        }
        
        console.log(this.wrapper)
    },
};
XDom.selfClosingTags = {
    hr: 1,
    br: 1,
    col: 1,
    img: 1,
    textarea: 1,
    input: 1,
    embed: 1,
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
XDom.Stack.prototype.clear = function() {
    while(0 !== this.size) {
        this.pop();
    }
};
XDom.StackNode = function(data, prev, next) {
    this.data = data;
    this.prev = prev;
    this.next = next;
};
