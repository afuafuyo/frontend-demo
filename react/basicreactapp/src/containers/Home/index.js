import React from 'react';
import { connect } from 'react-redux';

import { loadHomeData } from './actions.js';
import css from './style.css';

class Home extends React.Component {
    
    componentDidMount() {
        this.props.dispatch(loadHomeData());
    }
    
    getList() {
        if(null === this.props.homeR.data) {
            return <span>home page no data</span>
        }
        
        var ret = [];
        for(var i=0, len=this.props.homeR.data.length; i < len; i++) {
            ret.push(<div key={i}>姓名：{this.props.homeR.data[i].name} -- 年龄：{this.props.homeR.data[i].age}</div>);
        }
        
        return ret;
    }
    
    render() {
        return (
        <div className="home-wrapper">
        {this.getList()}
        </div>
        )
    }
}

export default connect(function(state){
    return { homeR: state.homeR };
})(Home);
