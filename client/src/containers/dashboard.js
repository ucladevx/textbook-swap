import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux'
import NavBar from '../components/navbar'
import '../styles/dashboard.css'

class Dashboard extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return (
            <div className="dashboardContainer">
                <NavBar></NavBar>
                <div className="topBar">
                    <p>Hi Suyash Saxena, this is your dashboard</p>
                    <button>ALL</button>
                    <button>REQUESTED</button>
                    <button>MATCHED</button>
                    <button>REJECTED</button>
                </div>
                <div className="cardContainer">
                     
                </div>
            </div>
        )
    }
}

export default connect(null)(withRouter(Dashboard))
