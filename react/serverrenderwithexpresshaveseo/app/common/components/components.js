import React from 'react';

export class DefaultContent extends React.Component {
    render() {
        return (
            <div>
                <p>
                    <a href="/page1">page1</a>&nbsp;
                    <a href="/page2">page2</a>
                </p>
                {this.props.children}
            </div>
        );
    }
}

export class Content1 extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            someData: 'someData'
        };
        
        this.change = this.change.bind(this);
    }
    
    change() {
        this.setState({someData: 'new data'});
    }
    
    render() {
        return (
            <div>
                <p>{this.state.someData}</p>
                <button onClick={this.change}>点击修改数据</button>
            </div>
        );
    }
}

export class Content2 extends React.Component {
    render() {
        return (<div>page2 content</div>);
    }
}
