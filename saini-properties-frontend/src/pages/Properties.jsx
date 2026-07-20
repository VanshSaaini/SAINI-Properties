import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';
import { propertiesData } from '../data/propertiesData';
import './Properties.css';

export default function Properties() {
  return (
    <div className="properties-page">
      <Navbar />

      <div className="properties-header fade-in-up">
        <h1>Available <span>Configurations</span></h1>
        <p>Verified listings across prime locations — every layout checked against actual carpet and built-up specifications.</p>
      </div>

      <div className="properties-grid">
        {propertiesData.map((item) => (
          <PropertyCard key={item.id} property={item} />
        ))}
      </div>

      <Footer />
    </div>
  );
}