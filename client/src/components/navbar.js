import React, { Component } from 'react';
import { Navbar, Nav, MenuItem, NavItem, NavDropdown } from 'react-bootstrap'
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css'
import {connect} from 'react-redux'
import {userLogin} from '../actions';

import '../styles/navbar.css'

import NavBarLogo from '../img/new_logo_navbar.svg'

class NavBar extends Component {
    
    handleSelect(key){
        switch (key) {
            case 1:
                console.log("Show about page")
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
                        <NavItem eventKey={1}>ABOUT</NavItem>
                        <NavItem eventKey={2}>CONTACT US</NavItem>
                        <NavItem eventKey={3}>BUG REPORTING</NavItem>
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

export default connect(mapStateToProps)(NavBar)

