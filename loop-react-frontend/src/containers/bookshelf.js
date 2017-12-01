import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux'

import NavBar from '../components/navbar'
import Footer from '../components/footer'
import Card from '../components/card'


class Bookshelf extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return (
            <div className="App">
              <NavBar></NavBar>
              <Footer></Footer>
            </div>
        )
    }
}

export default connect(null)(withRouter(Bookshelf))
