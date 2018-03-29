import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import {connect} from 'react-redux'

import '../styles/navbar.css'

import NavBarLogo from '../img/new_logo_navbar.svg'

import axios from 'axios'

const ROOT = 'http://www.loop-trading.com:3000'
axios.defaults.withCredentials = true;


class NavBar extends Component {
    runAlgorithm(){
        console.log("RUN")
        axios.get(ROOT+'/api/algorithm/run')
        .then((res) => {
            window.location.reload()
        })
        .catch((e) => console.log(e))
    }


    handleSelect(key){
        switch (key) {
            case 1:
                this.props.history.push('/guide')
                break
            case 2:
                window.location.replace('mailto:loop.textbook.swap@gmail.com');
                break
            case 3:
                var win = window.open('https://goo.gl/forms/Dogs4uqvED1LIq1r1', '_blank');
                win.focus();
                break
            case 4:
                console.log("Logout")
                window.location.replace("http://www.loop-trading.com:3000/logout/facebook");
                break   
            case 5:
                console.log("Login")
                window.location.replace("http://www.loop-trading.com:3000/login/facebook");
                break
            case 6:
                this.props.history.push('/bookshelf')
                break
        }
    }
    
    render() {
        return (
            <Navbar collapseOnSelect fluid={true} onSelect={key => this.handleSelect(key)} fixedTop={false}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <img 
                            alt="LOOP" 
                            onClick={()=>{ this.runAlgorithm(); this.props.history.push('/') } }
                            className="navbar-logo" src={NavBarLogo}/>
                        
                        {
                            /*
                            <img 
                            alt="LOOP" 
                            onClick={()=>this.props.history.push('/')}
                            className="navbar-logo" src={NavBarLogo}/>
                            */
                        }
                        
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav pullRight>
                        {
                            (true || this.props.location.pathname === "/") &&
                            <NavItem eventKey={1}>TRADING GUIDE</NavItem>
                        }
                        <NavItem eventKey={3}>CONTACT US</NavItem>
                        {
                            this.props.user != null ?
                                (
                                    this.props.location.pathname === "/" || this.props.location.pathname === "/guide" ? 
                                    <NavItem eventKey={6}>MY BOOKSHELF</NavItem> :
                                    <NavItem eventKey={4}>LOGOUT</NavItem>
                                ) :
                                <NavItem eventKey={5}>LOGIN</NavItem>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
      );
    }
}

function mapStateToProps(state){
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(withRouter(NavBar))