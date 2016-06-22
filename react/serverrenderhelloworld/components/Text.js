'use strict';

var React = require('react');

class Text extends React.Component {
    render() {
        return (
            <span>{this.props.children}</span>
        );
    }
}

// node api 模块导出
module.exports = Text;