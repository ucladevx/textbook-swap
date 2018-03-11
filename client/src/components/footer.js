import React from 'react';

import '../styles/vendors/footer.css'

import Facebook from 'react-icons/lib/fa/facebook-official'
import Twitter from 'react-icons/lib/fa/twitter'
import Google from 'react-icons/lib/fa/google'

const Footer = () => {
    return (
        <footer id="myFooter">
        <div className="social-networks">
            <a href="#" className="twitter"><Facebook/></a>
            <a href="#" className="facebook"><Twitter></Twitter></a>
            <a href="#" className="google"><Google></Google></a>
            <p>© 2017 Loop UCLA DevX </p>
        </div>
    </footer> 
    )
}

export default Footer