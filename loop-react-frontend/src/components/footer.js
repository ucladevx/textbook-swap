import React from 'react';
import '../styles/vendors/footer.css'
import '../styles/vendors/bootstrap.min.css'
import Facebook from 'react-icons/lib/fa/facebook-official'
import Twitter from 'react-icons/lib/fa/twitter'
import Google from 'react-icons/lib/fa/google'

const Footer = () => {
    return (
    <footer id="myFooter">
        <div className="container">
            <div className="row">
                <div className="col-sm-3 myCols">
                    <h5>Get started</h5>
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Sign up</a></li>
                        <li><a href="#">Downloads</a></li>
                    </ul>
                </div>
                <div className="col-sm-3 myCols">
                    <h5>About us</h5>
                    <ul>
                        <li><a href="#">Company Information</a></li>
                        <li><a href="#">Contact us</a></li>
                        <li><a href="#">Reviews</a></li>
                    </ul>
                </div>
                <div className="col-sm-3 myCols">
                    <h5>Support</h5>
                    <ul>
                        <li><a href="#">FAQ</a></li>
                        <li><a href="#">Help desk</a></li>
                        <li><a href="#">Forums</a></li>
                    </ul>
                </div>
                <div className="col-sm-3 myCols">
                    <h5>Legal</h5>
                    <ul>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Terms of Use</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div className="social-networks">
            <a href="#" className="twitter"><Facebook/></a>
            <a href="#" className="facebook"><Twitter></Twitter></a>
            <a href="#" className="google"><Google></Google></a>
        </div>
        <div className="footer-copyright">
            <p>© 2017 Loop UCLA DevX </p>
        </div>
    </footer> 
    )
}

export default Footer