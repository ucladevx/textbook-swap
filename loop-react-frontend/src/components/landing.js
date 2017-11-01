import React from 'react';
import '../styles/home.css'
import Book1 from '../img/book1.svg'
import Book2 from '../img/book2.svg'
import Hero from '../new_images/hero_min.png'
import HeroMobile from '../new_images/hero_mobile.png'
import Animation from '../new_images/loop-animation.gif'
import ReactSVG from 'react-svg';
import Responsive from 'react-responsive';

const Desktop = ({ children }) => <Responsive minWidth={992} children={children} />;
const Tablet = ({ children }) => <Responsive minWidth={768} maxWidth={992} children={children} />;
const Mobile = ({ children }) => <Responsive maxWidth={768} children={children} />;
const Default = ({ children }) => <Responsive minWidth={768} children={children} />;

const Landing = () => {
  var heroStyles = {
      desktop: {
          backgroundImage: `url(${Hero})`
      },
      mobile: {
          backgroundImage: `url(${HeroMobile})`
      }
  }
  
  var heroTextStyles = {
      desktop: {
        paddingTop: '75vh'
      },
      mobile: {
        paddingTop: '70vh'
      }
  }
  
  return (
    <div>
        <Desktop>
            <div className="hero" style={heroStyles.desktop}>
              <div className="heroText" style={heroTextStyles.mobile}>
                    <a className="btn btn-default" href="/login/facebook" role="button">LOGIN WITH FACEBOOK</a>
              </div>
            </div>
        </Desktop>
        <Mobile>
            <div className="hero" style={heroStyles.mobile}>
              <div className="heroText" style={heroTextStyles.mobile}>
                    <a className="btn btn-default" href="/login/facebook" role="button">LOGIN WITH FACEBOOK</a>
              </div>
            </div>
        </Mobile>
        <Tablet>
            <div className="hero" style={heroStyles.desktop}>
              <div className="heroText" style={heroTextStyles.mobile}>
                    <a className="btn btn-default" href="/login/facebook" role="button">LOGIN WITH FACEBOOK</a>
              </div>
            </div>
        </Tablet>
    </div>
  );
}

export default Landing

{/*              <div className="hero" style={heroStyles}>
                  <div className="heroText">
                        <a className="btn btn-default fbLogin" href="/login/facebook" role="button">LOGIN WITH FACEBOOK</a>
                  </div>
              </div>
              <div id="first">
        <div className="container">
          <div className="col-md-4 col-md-offset-8">
            <img id="top-right-book" src={Book1} />
          </div>
        </div>
        <div className="container" id="logo">
          <div className="col-xs-3">
            <img id="bottom-left-book" src={Book2} />
          </div>
          <div className="col-xs-6" />
            {/*<ReactSVG
                path="../img/logo.svg"
                callback={svg => console.log(svg)}
            />*
            {Logo}
          <div className="col-xs-3" />
        </div>
        <div className="container bottom-align-text" id="buttons">
          <span className="col-xs-4 col-xs-offset-4 text-center">
            <a className="btn btn-default" href="/login/facebook" role="button">LOGIN WITH FACEBOOK</a>
          </span>
        </div>
      </div>*/}