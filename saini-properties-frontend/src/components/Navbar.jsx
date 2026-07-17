import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h2>SAINI<span>Properties</span></h2>
          </Link>
        </div>
        
        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/properties" className="nav-link">Properties</Link>
          <Link to="/services" className="nav-link">Services</Link>
          <Link to="/reviews" className="nav-link">Reviews</Link>
          
          {/* Enhanced Action Buttons Group */}
          <div className="nav-auth-group">
            <Link to="/login" className="nav-link-login">Login</Link>
            <Link to="/register" className="nav-btn-register">Register</Link>
          </div>
        </div>

        <div className="navbar-hamburger" onClick={() => setIsOpen(!isOpen)}>
          <span className={`bar ${isOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isOpen ? 'open' : ''}`}></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;