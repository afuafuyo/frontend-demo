import React from 'react';
import { render } from 'react-dom';

class App extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div>{this.props.text}</div>
        );
    }
}

render(
    <App text="Hello react" />,
    document.getElementById('appwrapper')
);