import React from 'react';

export default function () {
  return (
    <<!DOCTYPE>
      <html>
        <head>
          <meta charset="utf-8">
            <title>Loops - Dashboard</title>
            <link
              crossorigin="anonymous"
              href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
              integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
              rel="stylesheet"
              type="text/css"
            >
              <link href="css/dashboard.css" rel="stylesheet" type="text/css">
                <link href="css/new_trade_form.css" rel="stylesheet" type="text/css">
                  <link href="css/navbar.css" rel="stylesheet" type="text/css">
                    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js" />
                    <script
                      crossorigin="anonymous"
                      integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa"
                      src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
                    />
                  </link>
                  <body>
                    <h1>Search for Textbooks</h1>
                    <nav className="navbar navbar-default navbar-fixed-top navbar-default">
                      <div className="container-fluid">
                        <div className="navbar-header">
                          <a className="navbar-brand" href="#">
                            <img alt="LOOP" id="navbar_logo" src="/assets/logo_navbar.svg" />
                          </a>
                          <ul className="nav navbar-nav navbar-right">
                            <li>
                              <a href="#">Help</a>
                            </li>
                            <li>
                              <a href="#" id="nav_about">Settings</a>
                            </li>
                            <li>
                              <a href="/logout/facebook">Logout</a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <a className="btn" data-popup-open="popup-matched-trade" href="">
                        Pretend this is a card
                      </a>
                      <div className="row" id="forms">
                        <div className="col-lg-6" id="ownedForm">
                          <div className="input-group">
                            <input
                              className="form-control"
                              id="ownedInput"
                              placeholder="Search for owned book..."
                              type="text"
                            >
                              <span className="input-group-btn">
                                <button className="btn btn-default" id="addOwned" type="button">
                                  Add
                                </button>
                              </span>
                            </input>
                          </div>
                          <div className="col-lg-6" id="wantedForm">
                            <div className="input-group">
                              <input
                                className="form-control"
                                id="wantedInput"
                                placeholder="Search for wanted book..."
                                type="text"
                              >
                                <span className="input-group-btn">
                                  <button className="btn btn-default" id="addWanted" type="button">
                                    Request
                                  </button>
                                </span>
                              </input>
                            </div>
                          </div>
                          <div className="row" id="searchResults">
                            <div className="col-lg-6" id="ownedSearchResultsBox">
                              <ul className="list-group" id="ownedSearchResultsList" />
                            </div>
                            <div className="col-lg-6" id="wantedSearchResultsBox" />
                          </div>
                          <script src="/js/dashboard.js" />
                          <script src="/js/navbar.js" />
                          <script src="/js/new_trade_form.js" />
                        </div>
                      </div>
                    </nav>
                  </body>
                </link>
              </link>
            </link>
          </meta>
        </head>
      </html>
    </<!DOCTYPE>
  );
}

