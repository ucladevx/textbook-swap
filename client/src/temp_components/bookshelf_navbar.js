import React from 'react';

export default function () {
  return (
    <link href="css/bookshelf_navbar.css" rel="stylesheet" type="text/css" />
    <nav className="navbar navbar-default navbar-fixed-top">
      <div className="container-fluid">
        <div className="navbar-header">
          <a className="navbar-brand" href="/api/algorithm/run">
            <img alt="LOOP" id="navbar_logo" src="img/new_logo_navbar.svg" />
          </a>
        </div>
        <ul className="nav navbar-nav navbar-right">
          <li>
            <a href="#">TRADING GUIDE</a>
          </li>
          <li>
            <a href="/logout/facebook">LOGOUT</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

