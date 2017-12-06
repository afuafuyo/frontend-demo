import React from 'react';
import { connect } from 'react-redux';

import css from './style.css';

class Home extends React.Component {
    
    componentDidMount() {
        console.log('home page: ', this.props);
    }
    
    render() {
        return (
        <div className="home-wrapper">
            this is home page
        </div>
        )
    }
}

export default connect(function(state){
    return { homeR: state.homeR };
})(Home);
