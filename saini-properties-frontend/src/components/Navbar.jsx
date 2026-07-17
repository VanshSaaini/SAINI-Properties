import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Basic client check for active login status flag
  const token = localStorage.getItem("token");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* Brand Identity Branding Logo */}
        <div className="navbar-logo">
          <h2>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              SAINI<span>Properties</span>
            </Link>
          </h2>
        </div>

        {/* Hamburger Element for Mobile Displays */}
        <div className="navbar-hamburger" onClick={toggleMenu}>
          <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
          <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
          <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
        </div>

        {/* Dynamic Navigation Drawer Links */}
        <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/properties" className="nav-link" onClick={() => setIsMenuOpen(false)}>Properties</Link>
          <Link to="/services" className="nav-link" onClick={() => setIsMenuOpen(false)}>Services</Link>
          <Link to="/reviews" className="nav-link" onClick={() => setIsMenuOpen(false)}>Reviews</Link>
          
          {/* Dynamic Authentic CTA Action Routing Block */}
          <div className="nav-auth-group">
            {!token ? (
              <>
                <Link to="/login" className="nav-link-login" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="nav-btn-register" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
              </>
            ) : (
              <button className="nav-btn" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}