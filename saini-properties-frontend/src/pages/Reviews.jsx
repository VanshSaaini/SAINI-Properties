import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Reviews() {
  return (
    <div className="page-layout-wrapper" style={{ paddingTop: '100px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="page-content" style={{ flex: 1, width: '90%', maxWidth: '1200px', margin: '2rem auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1f2937', marginBottom: '1rem' }}>
          Client <span>Reviews & Testimonials</span>
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>See why thousands of buyers and happy families trust SAINI Properties for their investments.</p>
      </div>
      <Footer />
    </div>
  );
}