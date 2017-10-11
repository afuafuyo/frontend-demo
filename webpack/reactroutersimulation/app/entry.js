import React from 'react';
import { render } from 'react-dom';

class DefaultContent extends React.Component {
    render() {
        return (<div>defaultcontent</div>);
    }
}
class Content1 extends React.Component {
    render() {
        return (<div>content1</div>);
    }
}
class Content2 extends React.Component {
    render() {
        return (<div>content2</div>);
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            route: window.location.hash.substr(1)
        };
    }
    
    componentDidMount() {
        window.addEventListener('hashchange', () => {
            this.setState({
                route: window.location.hash.substr(1)
            })
        });
    }
    
    render() {
        var Content = null;
        switch (this.state.route) {
            case '/page1': Content = Content1; break;
            case '/page2': Content = Content2; break;
            default: Content = DefaultContent;
        }
        
        return (
            <Content />
        );
    }
}

render(
    <App />,
    document.getElementById('appwrapper')
);