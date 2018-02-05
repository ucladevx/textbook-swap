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
              {/*<header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className="App-title">Welcome to Loop</h1>
              </header>
              <p className="App-intro">
                To get started, edit <code>src/Main.js</code> and save to reload.
              </p>*/}
              <Landing/>
            </div>
        )
    }
}

export default connect(null)(withRouter(Home))
