import React from 'react';
import '../assets/css/footer.css'; 

export default function Footer() {
  // console.log("footer component rendered!");
    return (
      <div className='footer-container'>
        <div className='footer'>
          <a className="footer-logo" href='/'>ELEMENTOPIA</a>
          
          <p className='copyright-text'>©2025 Elementopia. All rights reserved</p>

          <div className='footer-links'>
            <a>Privacy Policy</a>
            <a>Terms of Service</a>
            <a>Contact</a>
          </div>
        </div>
      </div>

    );
}