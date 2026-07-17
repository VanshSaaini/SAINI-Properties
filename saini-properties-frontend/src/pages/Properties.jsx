import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PropertyCard from './PropertyCard';
import './Properties.css';

// NOTE: replace with a live fetch to the Spring Boot API (e.g. GET /api/properties)
// once the endpoint is available. Shape kept close to what that response should look like.
const myPropertiesArray = [
  {
    id: 1,
    name: "Luxury Villa in Beverly Hills",
    price: "2,500,000",
    location: "Beverly Hills, CA",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
    badge: "Featured",
    beds: 5,
    baths: 4,
    area: "4,200 sq ft",
  },
  {
    id: 2,
    name: "Modern Downtown Penthouse",
    price: "850,000",
    location: "Downtown, LA",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    badge: "New",
    beds: 3,
    baths: 2,
    area: "1,850 sq ft",
  },
  {
    id: 3,
    name: "Cozy Suburban Family Home",
    price: "420,000",
    location: "Pasadena, CA",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
    beds: 4,
    baths: 3,
    area: "2,300 sq ft",
  },
];

export default function Properties() {
  return (
    <div className="properties-page">
      <Navbar />

      <div className="properties-header fade-in-up">
        <h1>Available <span>Configurations</span></h1>
        <p>Verified listings across prime locations — every layout checked against actual carpet and built-up specifications.</p>
      </div>

      <div className="properties-grid">
        {myPropertiesArray.map((item) => (
          <PropertyCard key={item.id} property={item} />
        ))}
      </div>

      <Footer />
    </div>
  );
}
