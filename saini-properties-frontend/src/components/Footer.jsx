import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Column 1: Brand Info */}
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <h2>SAINI<span>Properties</span></h2>
          </div>
          <p className="brand-description">
            Helping you find your dream home in prime locations. Discover seamless buying, renting, and investing experiences tailored just for you.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/properties">Properties</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/reviews">Reviews</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div className="footer-col">
          <h3>Contact Us</h3>
          <ul className="footer-contact">
            <li>
              <span className="contact-icon">📍</span> 
              123 Real Estate Ave, Suite 100
            </li>
            <li>
              <span className="contact-icon">📞</span> 
              +91 93891 46371 / 95362 36577
            </li>
            <li>
              <span className="contact-icon">✉️</span> 
              vs7579030670@gmail.com
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>© 2026 SAINI PROPERTIES. All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}