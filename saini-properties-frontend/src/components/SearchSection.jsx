import React, { useState } from 'react';
import './SearchSection.css';

const SearchSection = () => {
  const [propertyType, setPropertyType] = useState('3bhk');
  const [areaType, setAreaType] = useState('carpet');

  // Hardcoded data breakdown for your specific project
  const specifications = {
    '3bhk': {
      name: '3 BHK Premium Apartment',
      carpet: '1,100 – 1,300 sq ft',
      builtUp: '1,250 – 1,450 sq ft',
      superBuiltUp: '1,400 – 1,600 sq ft'
    },
    '2bhk': {
      name: '2 BHK Smart Apartment',
      carpet: '700 – 850 sq ft',
      builtUp: '800 – 950 sq ft',
      superBuiltUp: '900 – 1,100 sq ft'
    },
    'shop': {
      name: 'Commercial Shop / Retail',
      carpet: '180 – 250 sq ft',
      builtUp: '200 – 275 sq ft',
      superBuiltUp: '220 – 300 sq ft'
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log({
      location: "Prime Project Location",
      type: propertyType,
      areaType: areaType,
      selectedRange: specifications[propertyType][areaType]
    });
  };

  return (
    <div className="search-section-wrapper">
      <div className="search-container">
        
        {/* Dynamic header reflecting your unique project specs */}
        <div className="search-header-info">
          <h3>Project Configuration Planner</h3>
          <p>Currently showing verified sizes for our exclusive development site.</p>
        </div>

        <form className="search-bar-form" onSubmit={handleSearch}>
          
          {/* Locked Location Input */}
          <div className="input-group">
            <label>Project Location</label>
            <input 
              type="text" 
              value="📍 Prime Site Location (Exclusive)" 
              disabled 
              className="disabled-location-input"
            />
          </div>

          {/* Unit Type Selection */}
          <div className="input-group">
            <label>Unit Layout</label>
            <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
              <option value="3bhk">3 BHK Luxury Flat</option>
              <option value="2bhk">2 BHK Executive Flat</option>
              <option value="shop">Commercial Shop</option>
            </select>
          </div>

          {/* Area Type Selection */}
          <div className="input-group">
            <label>Area Framework</label>
            <select value={areaType} onChange={(e) => setAreaType(e.target.value)}>
              <option value="carpet">Carpet Area</option>
              <option value="builtUp">Built-up Area</option>
              <option value="superBuiltUp">Super Built-up Area</option>
            </select>
          </div>

          {/* Search/Inquiry Action Button */}
          <button type="submit" className="search-submit-btn">
            Check Layout
          </button>
        </form>

        {/* Live Area Matrix Box underneath */}
        <div className="area-result-badge">
          <span className="badge-title">Estimated Size Range:</span>
          <strong className="badge-value">
            {specifications[propertyType][areaType]}
          </strong>
        </div>

      </div>
    </div>
  );
};

export default SearchSection;