import Dom from './Dom';
import HashObject from './HashObject';

/**
 * The DisplayObject class is the base class for all objects that can be display on screen
 */
export default class DisplayObject extends HashObject {

    constructor() {
        super();

        this.dom = new Dom();
    }

    /**
     * 内部 dom 准备完毕
     */
    internalDomReady() {}

    /**
     * 获取 html 文档片段 这个文档片段只能有一个父级元素
     */
    render() {
        return null;
    }

    /**
     * 获取 dom 对象
     */
    getDom() {
        let html = this.render();

        if(null === html) {
            return null;
        }

        this.dom.parse(html);

        this.internalDomReady();

        return this.dom.getDom();
    }

}
