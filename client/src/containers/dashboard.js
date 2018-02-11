import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux'
import NavBar from '../components/navbar'
import CardContainer from '../containers/cardContainer'
import '../styles/dashboard.css'
import {userLogin} from '../actions';

class Dashboard extends Component{
    componentDidMount(){
        console.log("Component Did Mount");
        this.props.userLogin
    }
    
    constructor(props){
        super(props)
    }

    render(){
        if (this.props.user == null){
            return (
            <div className="dashboardContainer">
                Loading...
            </div>
            )
        } 
        return (
            <div className="dashboardContainer">
                <div className="topBar">
                    <p>Hi {this.props.user.name}, this is your dashboard</p>
                    <button>ALL</button>
                    <button>REQUESTED</button>
                    <button>MATCHED</button>
                    <button>REJECTED</button>
                </div>
                <div className="cardContainer">
                     <CardContainer/>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, userLogin)(withRouter(Dashboard))
