import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './PageLayout.css';

const services = [
  {
    icon: '🏠',
    title: 'End-to-End Consulting',
    description: 'From shortlisting locations to closing paperwork, we guide every step of the buying or selling process.',
  },
  {
    icon: '🔑',
    title: 'Rental Management',
    description: 'Tenant sourcing, verification, and ongoing maintenance coordination for hands-off rental income.',
  },
  {
    icon: '⚖️',
    title: 'Legal Support',
    description: 'Title verification, documentation review, and registration assistance handled by our legal partners.',
  },
  {
    icon: '📐',
    title: 'Layout Verification',
    description: 'Every listing carpet and built-up area is checked on-site before it goes live on the platform.',
  },
  {
    icon: '💰',
    title: 'Investment Advisory',
    description: 'Data-backed guidance on emerging locations and price trends to help you invest with confidence.',
  },
  {
    icon: '🛠️',
    title: 'Post-Sale Support',
    description: 'Interior referrals, utility transfers, and move-in coordination after your deal closes.',
  },
];

export default function Services() {
  return (
    <div className="page-layout-wrapper">
      <Navbar />
      <div className="page-content fade-in-up">
        <h1>Our Professional <span>Services</span></h1>
        <p>From end-to-end consulting and rental property management to legal support, we cover it all.</p>

        <div className="page-cards-grid">
          {services.map((service) => (
            <div className="page-card" key={service.title}>
              <div className="page-card-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
