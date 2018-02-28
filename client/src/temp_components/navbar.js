import React from 'react';

export default function () {
  return (
    <link href="css/navbar.css" rel="stylesheet" type="text/css" />
    <nav className="navbar navbar-default navbar-fixed-top navbar-default">
      <div className="container-fluid">
        <div className="navbar-header">
          <a className="navbar-brand" href="#">
            <img alt="LOOP" id="navbar_logo" src="img/new_logo_navbar.svg" />
          </a>
        </div>
        <ul className="nav navbar-nav navbar-right">
          <li>
            <a href="#third">CONTACT US</a>
          </li>
          <li>
            <a href="#second" id="nav_about">ABOUT</a>
          </li>
          <li>
            <a href="/login/facebook">LOGIN</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

