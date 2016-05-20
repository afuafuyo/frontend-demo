'use strict';

var React = require('react');
var Text = require('./Text');

class List extends React.Component {
    render() {
        var data = this.props.data;
        var string = data.map(function(v){
            return (
                <Text key={v}>{v}</Text>
            );
        });
        
        return (
            <div>{string}</div>
        );
    }
}

// node api 模块导出
module.exports = List;