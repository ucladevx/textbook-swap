import React from 'react';

export default function () {
  return (
    <div className="popup" data-popup="modify-trade">
      <div
        className="carousel slide"
        data-interval="false"
        data-ride="carousel"
        data-wrap="false"
        id="myEditTradeCarousel"
      >
        <div className="popup-inner">
          { /* Indicators */ }
          <ol className="carousel-indicators">
            <li className="active" data-slide-to="0" data-target="#myEditTradeCarousel" />
            <li data-slide-to="1" data-target="#myEditTradeCarousel" />
          </ol>
          { /* Wrapper for slides */ }
          <div className="carousel-inner">
            <div className="item active" id="first-popup">
              <a className="popup-close" data-popup-close="popup-1" href="#">x</a>
              <div className="row slideHeader">
                <h3 className="slideTitle">TRADE INFO</h3>
                <img className="top-right-bookshelf" src="./images/Bookshelf_NewTrade1.svg" />
              </div>
              <div className="slideContent">
                <div className="row confirmWrapper">
                  <div className="col-md-6">
                    <h5 className="confirmSubtitle">OFFERING</h5>
                    <div className="row confirmBookInfoBox">
                      <div className="col-md-6">
                        <img alt="Card image cap" id="confirmTradeOwnedBookImg" src="" />
                      </div>
                      <div className="col-md-6 confirmOwnedBookText">
                        <h6 id="confirmTradeOwnedBookTitle" />
                        <h6 id="confirmTradeOwnedBookAuthor" />
                        <h6 id="confirmTradeOwnedBookIsbn" />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="confirmWantedBooksBox">
                      <h5 className="confirmSubtitle">TRADES</h5>
                      <ul className="confirmBooksList list-group" id="confirmEditTradeBooksList" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row transitionButtonRow">
                <div className="col-sm-3 col-sm-offset-3 text-center">
                  <button className="btn btn-primary editButton" type="button">EDIT</button>
                </div>
                <div className="col-sm-3 text-center">
                  <button className="btn btn-primary deleteButton" type="button">DELETE</button>
                </div>
              </div>
              <img className="bottom-left-bookshelf" src="./images/Bookshelf_NewTrade2.svg" />
            </div>
            <div className="item">
              <a className="popup-close" data-popup-close="popup-1" href="#">x</a>
              <div className="row slideHeader">
                <h3 className="slideTitle">EDIT TRADE</h3>
                <img className="top-right-bookshelf" src="./images/Bookshelf_NewTrade1.svg" />
              </div>
              <div className="slideContent">
                <h5 className="slideMessage">Modify the books you want to add to your trades.</h5>
                <div className="row searchForm">
                  <div className="col-md-8" id="wantedForm">
                    <div className="input-group">
                      <input
                        aria-describedby="wantedInputAddon"
                        className="form-control wantedInput"
                        placeholder="Search by title, professor, or class"
                        type="text"
                      />
                      <div className="input-group-addon wantedInputAddon">
                        <span className="glyphicon glyphicon-search" />
                      </div>
                    </div>
                    <ul className="wantedSearchResultsList list-group" />
                  </div>
                  <col className="wantedBooksDisplay">
                    <ul className="wantedBooksList list-group" id="wantedEditTradeBooksList" />
                  </col>
                </div>
              </div>
              <div className="row transitionButtonRow">
                <div className="col-sm-3 col-sm-offset-3 text-center">
                  <button className="btn btn-primary undoEditButton" type="button">UNDO</button>
                </div>
                <div className="col-sm-3 text-center">
                  <button
                    className="btn btn-primary editButton"
                    id="confirmTradeChangesButton"
                    type="button"
                  >
                    SUBMIT
                  </button>
                </div>
              </div>
              <img className="bottom-left-bookshelf" src="./images/Bookshelf_NewTrade2.svg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
