import React from 'react';
import './Hero.css';

const stats = [
  { value: '120+', label: 'Properties Listed' },
  { value: '850+', label: 'Families Housed' },
  { value: '15 yrs', label: 'On the Ground' },
];

export default function Hero() {
  return (
    <header className="hero-banner">
      <div className="hero-overlay"></div>
      <div className="hero-content fade-in-up">
        <span className="hero-eyebrow">Saini Properties</span>
        <h1>Discover premium spaces built with <span>precision</span></h1>
        <p>Premium architectural configurations constructed around structural honesty, strategic locations, and verified layouts.</p>
        <div className="hero-cta-group">
          <button
            className="hero-btn-primary"
            onClick={() => document.querySelector('.search-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View Configurations
          </button>
          <button className="hero-btn-secondary">Learn More</button>
        </div>

        <div className="hero-stats">
          {stats.map((stat) => (
            <div className="hero-stat" key={stat.label}>
              <span className="hero-stat-value">{stat.value}</span>
              <span className="hero-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
