import React from 'react';

export default function () {
  return (
    <div className="popup" data-popup="popup-1">
      <div
        className="carousel slide"
        data-interval="false"
        data-ride="carousel"
        data-wrap="false"
        id="myCarousel"
      >
        <div className="popup-inner">
          { /* Indicators */ }
          <ol className="carousel-indicators">
            <li className="active" data-slide-to="0" data-target="#myCarousel" />
            <li data-slide-to="1" data-target="#myCarousel" />
            <li data-slide-to="2" data-target="#myCarousel" />
            <li data-slide-to="3" data-target="#myCarousel" />
          </ol>
          { /* Wrapper for slides */ }
          <div className="carousel-inner">
            <div className="item active" id="first-popup">
              <a className="popup-close" data-popup-close="popup-1" href="#">x</a>
              <div className="row slideHeader">
                <h3 className="slideTitle">NEW TRADE</h3>
                <img className="top-right-bookshelf" src="./images/Bookshelf_NewTrade1.svg" />
              </div>
              <div className="slideContent">
                <h5 className="slideMessage">Select the book you can offer.</h5>
                <div className="row searchForm">
                  <div className="col-lg-12">
                    <div className="input-group">
                      <input
                        aria-describedby="ownedInputAddon"
                        className="form-control"
                        id="ownedInput"
                        placeholder="Search by title, professor, or class"
                        type="text"
                      />
                      <span className="input-group-addon" id="ownedInputAddon">
                        <span className="glyphicon glyphicon-search" />
                      </span>
                    </div>
                    <ul className="list-group" id="ownedSearchResultsList" />
                  </div>
                </div>
              </div>
              <div className="row transitionButtonRow">
                <div className="col-lg-12 text-center" />
              </div>
              <img className="bottom-left-bookshelf" src="./images/Bookshelf_NewTrade2.svg" />
            </div>
            <div className="item">
              <a className="popup-close" data-popup-close="popup-1" href="#">x</a>
              <div className="row slideHeader">
                <h3 className="slideTitle">NEW TRADE</h3>
                <img className="top-right-bookshelf" src="./images/Bookshelf_NewTrade1.svg" />
              </div>
              <div className="slideContent">
                <h5 className="slideMessage">Confirm book!</h5>
                <div className="row confirmWrapper">
                  <div className="row ownedBookInfoBox">
                    <div className="col-md-8 ownedBookText">
                      <h4 id="ownedBookTitle" />
                      <h4 id="ownedBookAuthor" />
                      <h4 id="ownedBookIsbn" />
                      <h4 id="ownedBookClasses" />
                      <h4 id="ownedBookProfs" />
                    </div>
                    <div className="col-md-4">
                      <img alt="Card image cap" id="ownedBookImg" src="" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row transitionButtonRow">
                <div className="col-sm-3 col-sm-offset-3 text-center">
                  <button className="btn btn-primary prevButton" type="button">PREVIOUS</button>
                </div>
                <div className="col-sm-3 text-center">
                  <button className="btn btn-primary nextButton" type="button">NEXT</button>
                </div>
              </div>
              <img className="bottom-left-bookshelf" src="./images/Bookshelf_NewTrade2.svg" />
            </div>
            <div className="item">
              <a className="popup-close" data-popup-close="popup-1" href="#">x</a>
              <div className="row slideHeader">
                <h3 className="slideTitle">NEW TRADE</h3>
                <img className="top-right-bookshelf" src="./images/Bookshelf_NewTrade1.svg" />
              </div>
              <div className="slideContent">
                <h5 className="slideMessage">Select the books you want to add to your trades.</h5>
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
                    <ul className="wantedBooksList list-group" id="wantedTradeBooksList" />
                  </col>
                </div>
              </div>
              <div className="row transitionButtonRow">
                <div className="col-sm-3 col-sm-offset-3 text-center">
                  <button className="btn btn-primary prevButton" type="button">PREVIOUS</button>
                </div>
                <div className="col-sm-3 text-center">
                  <button className="btn btn-primary nextButton" id="wanted_list_next" type="button">
                    NEXT
                  </button>
                </div>
              </div>
              <img className="bottom-left-bookshelf" src="./images/Bookshelf_NewTrade2.svg" />
            </div>
            <div className="item">
              <a className="popup-close" data-popup-close="popup-1" href="#">x</a>
              <div className="row slideHeader">
                <h3 className="slideTitle">NEW TRADE</h3>
                <img className="top-right-bookshelf" src="./images/Bookshelf_NewTrade1.svg" />
              </div>
              <div className="slideContent">
                <h5 className="slideMessage">Confirm trades!</h5>
                <div className="row confirmWrapper">
                  <div className="col-md-6">
                    <h5 className="confirmSubtitle">OFFERING</h5>
                    <div className="row confirmBookInfoBox">
                      <div className="col-md-6">
                        <img alt="Card image cap" id="confirmOwnedBookImg" src="" />
                      </div>
                      <div className="col-md-6 confirmOwnedBookText">
                        <h6 id="confirmOwnedBookTitle" />
                        <h6 id="confirmOwnedBookAuthor" />
                        <h6 id="confirmOwnedBookIsbn" />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="confirmWantedBooksBox">
                      <h5 className="confirmSubtitle">TRADES</h5>
                      <ul className="confirmBooksList list-group" id="confirmTradeBooksList" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row transitionButtonRow">
                <div className="col-sm-3 col-sm-offset-3 text-center">
                  <button className="btn btn-primary prevButton" type="button">PREVIOUS</button>
                </div>
                <div className="col-sm-3 text-center">
                  <button className="btn btn-primary nextButton" id="confirmButton" type="button">
                    CONFIRM
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

