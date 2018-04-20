import HashObject from './HashObject';

/**
 * The DisplayObject class is the base class for all objects that can be display on screen
 */
export default class DisplayObject extends HashObject {

    constructor() {
        super();

        /**
         * document 对象引用
         */
        this.doc = document;

        /**
         * 文档片段
         */
        this.fragement = this.doc.createDocumentFragment();;

        /**
         * 对象的 dom 对象形式
         */
        this.dom = null;
    }

    /**
     * 内部 dom 准备完毕
     */
    internalDomReady() {}

    /**
     * 获取 html 文档片段 这个文档片段只能有一个父级元素
     */
    render() {
        return '';
    }

    /**
     * 获取 dom 对象
     */
    getDom() {
        let html = this.render();
        let tmp = this.doc.createElement('div');

        tmp.innerHTML = html;
        this.fragement.appendChild(tmp);

        this.dom = this.fragement.firstChild.firstChild;

        this.internalDomReady();

        return this.dom;
    }

}
