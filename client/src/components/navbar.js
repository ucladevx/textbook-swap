import React from 'react';
import { Navbar, Nav, MenuItem, NavItem, NavDropdown } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/navbar.css'
import NavBarLogo from '../img/new_logo_navbar.svg'
import axios from 'axios'

const ROOT = 'http://localhost:3000'
axios.defaults.withCredentials = true;

function runAlgorithm(){
    console.log("RUN")
    axios.get(ROOT+'/api/algorithm/run')
    .then((res) => {
        window.location.reload()
    })
    .catch((e) => console.log(e))
}

const NavBar = () => {
  return (
      <Navbar collapseOnSelect fluid={true} fixedTop={false}>
        <Navbar.Header>
            <Navbar.Brand>
                <img alt="LOOP" onClick={()=>runAlgorithm()}className="navbar-logo" src={NavBarLogo}/>
            </Navbar.Brand>
            <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
            <Nav pullRight>
                <NavItem eventKey={1} href="#">CONTACT US</NavItem>
                <NavItem eventKey={2} href="#">ABOUT</NavItem>
                <NavItem eventKey={2} href="#">LOGIN</NavItem>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar

