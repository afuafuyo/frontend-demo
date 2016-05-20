import React from 'react';

export class DefaultContent extends React.Component {
    render() {
        return (<div>wrapper: {this.props.children}</div>);
    }
}

export class Content1 extends React.Component {
    render() {
        return (<div>content1</div>);
    }
}

export class Content2 extends React.Component {
    render() {
        return (<div>content2</div>);
    }
}
