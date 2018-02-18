import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux'
import NavBar from '../components/navbar'
import CardContainer from '../containers/cardContainer'
import '../styles/dashboard.css'

class Dashboard extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return (
            <div className="dashboardContainer">
                <div className="topBar">
                    <p>Hi Suyash Saxena, this is your dashboard</p>
                    <div className="filterButtonGroup">
                        <button className="filterButton All_but active">ALL</button>
                        <button className="filterButton Requested_but">REQUESTED</button>
                        <button className="filterButton Matched_but">MATCHED</button>
                        <button className="filterButton Rejected_but">REJECTED</button>
                    </div>
                </div>
                <div className="cardContainer">
                     <CardContainer/>
                </div>
            </div>
        )
    }
}

export default connect(null)(withRouter(Dashboard))
