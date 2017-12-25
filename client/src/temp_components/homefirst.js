import React from 'react';

export default function () {
  return (
    <div id="first">
      <div className="container">
        <div className="col-md-4 col-md-offset-8">
          <img id="top-right-book" src="img/book1.svg" />
        </div>
      </div>
      <div className="container" id="logo">
        <div className="col-xs-3">
          <img id="bottom-left-book" src="img/book2.svg" />
        </div>
        <div className="col-xs-6" />
            <Logo />
        <div className="col-xs-3" />
      </div>
      <div className="container bottom-align-text" id="buttons">
        <span className="col-xs-4 col-xs-offset-4 text-center">
          <a className="btn btn-default" href="/login/facebook" role="button">LOGIN WITH FACEBOOK</a>
        </span>
      </div>
    </div>
  );
}

