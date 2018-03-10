import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux'

import '../App.css';
import Landing from '../components/landing'
import NavBar from '../components/navbar'
import Footer from '../components/footer'

class Home extends Component{
    render(){
        return (
            <div className="App">
              <Landing/>
            </div>
        )
    }
}

export default connect(null)(withRouter(Home))
