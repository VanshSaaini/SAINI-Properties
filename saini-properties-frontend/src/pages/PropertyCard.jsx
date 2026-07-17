import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PropertyCard.css";

export default function PropertyCard({ property }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  function handleCheckLayout(e) {
    if (!isLoggedIn) {
      e.preventDefault();
      alert("Please register or login to explore the properties!");
      navigate("/login");
    } else {
      navigate(`/property-layout/${property?.id}`);
    }
  }

  const {
    name = "Beautiful Suburban Home",
    price = "450,000",
    location = "Location unavailable",
    image,
    badge,
    beds,
    baths,
    area,
  } = property || {};

  return (
    <div className="property-card">
      <div className="property-card-media">
        {image && <img src={image} alt={name} loading="lazy" />}
        {badge && <span className="property-card-badge">{badge}</span>}
        <span className="property-card-price">${price}</span>
      </div>

      <div className="property-card-body">
        <h3>{name}</h3>
        <p className="property-card-location">📍 {location}</p>

        {(beds || baths || area) && (
          <div className="property-card-features">
            {beds && <span>🛏 {beds} Beds</span>}
            {baths && <span>🛁 {baths} Baths</span>}
            {area && <span>📐 {area}</span>}
          </div>
        )}

        <button
          onClick={handleCheckLayout}
          className={`layout-btn ${!isLoggedIn ? "locked-btn" : "unlocked-btn"}`}
        >
          {!isLoggedIn ? "🔒 Check Layout (Login Required)" : "Check Layout"}
        </button>
      </div>
    </div>
  );
}
