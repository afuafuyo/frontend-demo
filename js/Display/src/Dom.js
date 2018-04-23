import Stack from './Stack';

/**
 * Dom
 */
export default class Dom {

    constructor() {
        this.doc = document;
        this.dom = null;
        this.lookingBackTagstack = new Stack();

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

    onText(text) {
        var node = this.doc.createTextNode(text);

        this.lookingBackTagstack.tail().appendChild(node);
    }

    onClose(tagName) {
        tagName = tagName.toLowerCase();

        this.dom = this.lookingBackTagstack.pop()
    }

    onOpen(tagName, attributes) {
        tagName = tagName.toLowerCase();

        var isSelfClosingTag = 1 === Dom.selfClosingTags[tagName];
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
    }

    onComment(content) {
        var node = this.doc.createComment(content);

        this.lookingBackTagstack.tail().appendChild(node);
    }

    /**
     * 解析 html
     *
     * @param {String} html
     */
    parse(html) {
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

                        if(Dom.emptyAttributes[attrName]) {
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
    }

    /**
     * 获取 dom
     */
    getDom() {
        return this.dom;
    }

}

Dom.selfClosingTags = {
    hr: 1,
    br: 1,
    col: 1,
    img: 1,
    textarea: 1,
    input: 1,
    embed: 1
};
Dom.emptyAttributes = {
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
