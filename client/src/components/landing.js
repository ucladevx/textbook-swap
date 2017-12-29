// Libraries
import React from 'react';
import ReactSVG from 'react-svg';
import Responsive from 'react-responsive';
import FacebookLogin from 'react-facebook-login';

// Resources
import Book1 from '../img/book1.svg'
import Book2 from '../img/book2.svg'
import Hero from '../new_images/hero_min.png'
import HeroMobile from '../new_images/hero_mobile.png'
import Animation from '../new_images/loop-animation.gif'

// Components

// Styles
import '../styles/home.css'

// Responsive
const Desktop = ({ children }) => <Responsive minWidth={992} children={children} />;
const Tablet = ({ children }) => <Responsive minWidth={768} maxWidth={992} children={children} />;
const Mobile = ({ children }) => <Responsive maxWidth={768} children={children} />;
const Default = ({ children }) => <Responsive minWidth={768} children={children} />;

const responseFacebook = (response) => {
  console.log(response);
}

//const loadStuff = () => {
//    const req = axios.get('/api/search/search_textbooks?search_input=matrix')
//        .then((res) => {
//            console.log("Load", res.data)
//        })
//}

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
                    <a className="button button-default" href="http://localhost:5000/login/facebook" role="button">LOGIN WITH FACEBOOK</a>
                </div>
            </div>
        </Default>
        <Mobile>
            <div className="hero" style={mobileStyles.hero}>
                <div className="heroText">
                    <a className="button button-default" href="http://localhost:5000/login/facebook" role="button">LOGIN WITH FACEBOOK</a>
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
                Don't want to trade textbooks, but just want to buy or sell them with or for cash? No problem! When adding a book to your lists, just specify that you want to trade books for cash (or vice versa), and set a price that you're willing to accept.
                <br></br>
                <br></br>
            </div>
      </section>
      </div>
  );
}

export default Landing
