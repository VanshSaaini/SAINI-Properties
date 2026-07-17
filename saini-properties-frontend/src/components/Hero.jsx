import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <div className="hero-container" id="home">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>Find Your Dream Home Today</h1>
        <p>Discover the most exclusive properties in prime locations. Discover seamless buying, renting, and investing experiences tailored just for you.</p>
        <div className="hero-stats">
          <div className="stat-item">
            <h3>12k+</h3>
            <p>Premium Properties</p>
          </div>
          <div className="stat-item">
            <h3>5k+</h3>
            <p>Happy Customers</p>
          </div>
          <div className="stat-item">
            <h3>150+</h3>
            <p>Awards Won</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;