// Libraries
import React from 'react';
import Responsive from 'react-responsive';

// Resources
import Hero from '../new_images/hero_min.png'
import HeroMobile from '../new_images/hero_mobile.png'
import Animation from '../new_images/loop-animation.gif'

// Components

// Styles
import '../styles/home.css'

// Responsive
// const Desktop = ({ children }) => <Responsive minWidth={992} children={children} />;
// const Tablet = ({ children }) => <Responsive minWidth={768} maxWidth={992} children={children} />;
const Mobile = ({ children }) => <Responsive maxWidth={768} children={children} />;
const Default = ({ children }) => <Responsive minWidth={768} children={children} />;

const Landing = () => {
  var mobileStyles = {
      hero: {
          backgroundImage: `url(${HeroMobile})`
      }
  }

  var desktopStyles = {
      hero: {
          backgroundImage: `url(${Hero})`
      }
  }
  
  return (
      <div>
        <Default>
            <div className="hero" style={desktopStyles.hero}>
                <div className="heroText">
                    <a className="button button-default" href="http://www.loop-trading.com:3000/login/facebook" role="button">LOGIN WITH FACEBOOK</a>
                </div>
            </div>
        </Default>
        <Mobile>
            <div className="hero" style={mobileStyles.hero}>
                <div className="heroText">
                    <a className="button button-default" href="http://www.loop-trading.com:3000/login/facebook" role="button">LOGIN WITH FACEBOOK</a>
                </div>
            </div>
        </Mobile>


        <section className="detailSection detailContainer">
            <div className="detailImage">
                <img src={Animation} className="loopImage"></img>
            </div>
            <div className="detailText">
                <h2 className="detailTitle">What is Loop?</h2>
                Loop is an innovative way to trade, buy, and sell textbooks.
                <br></br>
                <br></br>
                Users pick what textbooks they want and what theyre willing to trade for them, and our algorithm will do the rest.
                <br></br>
                <br></br>
                By comparing book lists of all of our users, Loop automatically generates the smartest trade circles that maximize the number of people who get what they want, with almost no effort involved on the part of the user.
                <br></br>
                <br></br>
                People who get matched up with a trade can then meet up in person to complete the exchange.
                <br></br>
                <br></br>
            </div>
      </section>
      </div>
  );
}

export default Landing
