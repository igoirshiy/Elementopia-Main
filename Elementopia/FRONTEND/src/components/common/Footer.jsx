import React from 'react';
import '@/assets/styles/legacy/footer.css'; 

export default function Footer() {
    return (
      <div className='footer-container'>
        <div className='footer'>
          <a className="footer-logo" href='/'>ELEMENTOPIA</a>
          
          <p className='copyright-text'>©2026 Elementopia. All rights reserved</p>

          <div className='footer-links'>
            <a>Privacy Policy</a>
            <a>Terms of Service</a>
            <a>Contact</a>
          </div>
        </div>
      </div>

    );
}