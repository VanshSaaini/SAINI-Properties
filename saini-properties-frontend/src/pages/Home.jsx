import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer'
import SearchSection from '../components/SearchSection';
// Note: Future parts will be imported and placed here dynamically.

const Home = () => {
  return (
    <div className="homepage-wrapper">
      <Navbar />
      <Hero />
      <SearchSection />
      
      {/* Part 2 & Part 3 Components will hook in right below */}
      <Footer />
    </div>
  );
};

export default Home;