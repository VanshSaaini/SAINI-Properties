import React, { useState } from 'react';
import './SearchSection.css';

export default function SearchSection() {
  // Configuration data mapped explicitly to your real estate matrix
  const unitData = {
    "3 BHK": { carpet: "1,100–1,300 sq ft", builtUp: "1,250–1,450 sq ft", superBuiltUp: "1,400–1,600 sq ft" },
    "2 BHK": { carpet: "700–850 sq ft", builtUp: "800–950 sq ft", superBuiltUp: "900–1,100 sq ft" },
    "Shop": { carpet: "180–250 sq ft", builtUp: "200–275 sq ft", superBuiltUp: "220–300 sq ft" }
  };

  const [selectedUnit, setSelectedUnit] = useState("3 BHK");

  return (
    <section className="search-section">
      <div className="search-container">
        <div className="search-header">
          <h3>Explore Configurations & <span>Specifications</span></h3>
          <p>Filter dynamic space definitions instantly to evaluate real carpet vs built-up ratios.</p>
        </div>

        {/* Dynamic Selector Tabs */}
        <div className="tabs-container">
          {Object.keys(unitData).map((unit) => (
            <button
              key={unit}
              className={`tab-btn ${selectedUnit === unit ? "active-tab" : ""}`}
              onClick={() => setSelectedUnit(unit)}
            >
              {unit}
            </button>
          ))}
        </div>

        {/* Layout Specifications Metrics Matrix Display */}
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="metric-label">Carpet Area</span>
            <span className="metric-value">{unitData[selectedUnit].carpet}</span>
            <p className="metric-desc">Actual usable inner floor area of the unit.</p>
          </div>
          <div className="metric-card">
            <span className="metric-label">Built-up Area</span>
            <span className="metric-value">{unitData[selectedUnit].builtUp}</span>
            <p className="metric-desc">Inner area plus wall thickness & private balconies.</p>
          </div>
          <div className="metric-card">
            <span className="metric-label">Super Built-up Area</span>
            <span className="metric-value">{unitData[selectedUnit].superBuiltUp}</span>
            <p className="metric-desc">Total area including proportional common lobbies & stairs.</p>
          </div>
        </div>
      </div>
    </section>
  );
}