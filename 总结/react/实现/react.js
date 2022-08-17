import {REACT_ELEMENT_TYPE} from './ReactSymbols';

// 保留属性
const RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true
}

// 多个 children 依次往后传
function createElement(type, config, children) {
    let propName;
    const props = {};
    let key = null;
    let ref = null;

    if(config) {
        if(config.key) {
            key = config.key;
        }
        if(config.ref) {
            ref = config.ref;
        }

        for(propName in config) {
            if(!RESERVED_PROPS[propName]) {
                props[propName] = config[propName];
            }
        }
    }

    // 计算子元素
    const childrenLength = arguments.length - 2;
    if(1 === childrenLength) {
        props.children = children;

    } else if(childrenLength > 1) {
        const arr = new Array(childrenLength);
        for(let i=0; i<childrenLength; i++) {
            // 从第三个参数开始才是子元素
            arr[i] = arguments[i + 2];
        }

        props.children = arr;
    }

    return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref,
        props
    }
}

const React = {
    createElement
};

export default React;
