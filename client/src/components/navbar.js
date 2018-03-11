import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import {connect} from 'react-redux'

import '../styles/navbar.css'

import NavBarLogo from '../img/new_logo_navbar.svg'

class NavBar extends Component {
    
    handleSelect(key){
        switch (key) {
            case 1:
                window.location.replace('http://localhost:3000/guide');
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
                window.location.replace("http://localhost:3000/logout/facebook");
                break   
            case 5:
                console.log("Login")
                window.location.replace("http://localhost:3000/login/facebook");
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
                            onClick={()=>window.location.replace("http://localhost:5000/")}
                            className="navbar-logo" src={NavBarLogo}/>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav pullRight>
                        {
                            (true || this.props.location.pathname === "/") &&
                            <NavItem eventKey={1}>ABOUT</NavItem>
                        }
                        <NavItem eventKey={2}>CONTACT US</NavItem>
                        <NavItem eventKey={3}>REPORT A BUG</NavItem>
                        {
                            this.props.user != null ?
                            <NavItem eventKey={4}>LOGOUT</NavItem> :
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