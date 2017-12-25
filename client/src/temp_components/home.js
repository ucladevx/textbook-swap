import React from 'react';

export default function () {
  return (
    <<!DOCTYPE>
      <html>
        <head>
          <meta charset="utf-8">
            <title>Loops</title>
            <link
              crossorigin="anonymous"
              href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
              integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
              rel="stylesheet"
              type="text/css"
            >
              <link href="css/home.css" rel="stylesheet" type="text/css">
                <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" />
                <body>
                  { /* include navbar.pug */ } { /* include homefirst.pug */ }
                  <div id="second">
                    <div className="container">
                      <div className="row">
                        { /* .col-md-6.about_graphic */ }
                        <div className="col-md-6 about_animation">
                          <img id="loop-animation-gif" src="img/loop-animation.gif" />
                          <div className="col-md-3 about_column">
                            <h2 id="about-title">What is Loop?</h2>
                            <br>
                              <p>Loop is an innovative way to trade, buy, and sell textbooks.</p>
                              <br>
                                <p>
                                  Users pick what textbooks they want and what they are willing to trade for them, and our algorithm will do the rest.
                                </p>
                                <br>
                                  <p>
                                    By comparing book lists of all of our users, Loop automatically generates the smartest trade circles that maximize the number of people who get what they want, with almost no effort involved on the part of the user.
                                  </p>
                                  <br>
                                    <p>
                                      People who get matched up with a trade can then meet up in person to complete the exchange.
                                    </p>
                                  </br>
                                  <div className="col-md-3 about_column">
                                    <div className="col-md-12" id="first-transition-book">
                                      <img id="first-transition-book-img" src="img/book3.svg" />
                                      <p>
                                        Since trades are only matched between students from the same school, there is no need for shipping or waiting for books to arrive!
                                      </p>
                                      <br>
                                        <p>
                                          Don't want to trade textbooks, but just want to buy or sell them with or for cash? No problem! When adding a book to your lists, just specify that you want to trade books for cash (or vice versa), and set a price that you're willing to accept.
                                        </p>
                                      </br>
                                    </div>
                                  </div>
                                </br>
                                <div id="third">
                                  <div className="container">
                                    <div className="row">
                                      <div className="col-md-3" id="second-transition-book">
                                        <img id="second-transition-book-img" src="img/book4.svg" />
                                        <div className="col-md-6 contact">
                                          <h2 id="contact-title">Contact Us</h2>
                                          <form className="form-horizontal" id="contact-form">
                                            <div className="form-group">
                                              <label
                                                className="col-md-3 control-label"
                                                htmlFor="inputName"
                                              >
                                                Name
                                              </label>
                                              <div className="col-md-9">
                                                <input
                                                  className="form-control form-control"
                                                  id="inputName"
                                                  placeholder=""
                                                  type="text"
                                                />
                                              </div>
                                              <div className="form-group">
                                                <label
                                                  className="col-md-3 control-label"
                                                  htmlFor="inputEmail"
                                                >
                                                  Email
                                                </label>
                                                <div className="col-md-9">
                                                  <input
                                                    className="form-control form-control"
                                                    id="inputEmail"
                                                    placeholder=""
                                                    type="email"
                                                  />
                                                </div>
                                                <div className="form-group">
                                                  <label
                                                    className="col-md-3 control-label"
                                                    htmlFor="inputSubject"
                                                  >
                                                    Subject
                                                  </label>
                                                  <div className="col-md-9">
                                                    <input
                                                      className="form-control form-control"
                                                      id="inputSubject"
                                                      placeholder=""
                                                      type="text"
                                                    />
                                                  </div>
                                                  <div className="form-group">
                                                    <label
                                                      className="col-md-3 control-label"
                                                      htmlFor="inputMessage"
                                                    >
                                                      Message
                                                    </label>
                                                    <div className="col-md-9">
                                                      <textarea
                                                        className="form-control form-control"
                                                        id="inputMessage"
                                                        placeholder=""
                                                        rows="8"
                                                      />
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="text-center">
                                                  <a className="btn btn-default" href="#" role="button">
                                                    SEND
                                                  </a>
                                                </div>
                                              </div>
                                              <div className="col-md-3" id="third-transition-laptop">
                                                <img
                                                  id="third-transition-laptop-img"
                                                  src="img/laptop.svg"
                                                />
                                              </div>
                                              <div className="container">
                                                <span>
                                                  <div className="col-md-4 col-md-offset-4 text-center">
                                                    <span
                                                      aria-hidden="true"
                                                      className="glyphicon glyphicon-menu-up"
                                                      id="backtotop"
                                                    />
                                                  </div>
                                                </span>
                                              </div>
                                            </div>
                                          </form>
                                          <script
                                            src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"
                                          />
                                          <script
                                            crossorigin="anonymous"
                                            integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa"
                                            src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
                                          />
                                          <script src="js/navbar.js" />
                                          <script src="js/home.js" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </br>
                            </br>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </body>
              </link>
            </link>
          </meta>
        </head>
      </html>
    </<!DOCTYPE>
  );
}
