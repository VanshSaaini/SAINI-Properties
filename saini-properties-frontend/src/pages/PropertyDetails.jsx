import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { propertiesData } from "../data/propertiesData";
import axios from "axios";
import "./PropertyDetails.css";

export default function PropertyDetails() {
  const { id } = useParams();
  const property = propertiesData.find((item) => item.id === parseInt(id));

  const [queryMessage, setQueryMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  if (!property) {
    return (
      <div className="page-layout-wrapper">
        <Navbar />
        <div style={{ padding: "100px", textAlign: "center" }}>
          <h2>Property Not Found!</h2>
        </div>
        <Footer />
      </div>
    );
  }

  async function handleQuerySubmit(e) {
    e.preventDefault();
    setStatusMsg("Sending query...");

    try {
      // Backend service to trigger standard email to vs7579030670@gmail.com
      await axios.post("http://localhost:8080/api/contact-query", {
        targetEmail: "vs7579030670@gmail.com",
        userEmail: userEmail,
        propertyId: property.id,
        propertyName: property.name,
        message: queryMessage,
      });

      setStatusMsg("Your query has been sent successfully!");
      setQueryMessage("");
      setUserEmail("");
    } catch (err) {
      setStatusMsg("Failed to send query. Please try again later.");
    }
  }

  return (
    <div className="page-layout-wrapper">
      <Navbar />

      <div className="property-details-container">
        <h1>{property.name}</h1>
        <p className="location-tag">📍 {property.location}</p>

        {/* 1. 5 Photos Gallery */}
        <div className="photos-gallery">
          {property.images?.slice(0, 5).map((imgUrl, idx) => (
            <img key={idx} src={imgUrl} alt={`${property.name} ${idx + 1}`} />
          ))}
        </div>

        <div className="details-grid">
          <div className="main-info">
            {/* 2. Description */}
            <h3>Description</h3>
            <p>{property.description}</p>

            {/* 3. Pre-installed Items */}
            <h3>Pre-installed Items</h3>
            <ul>
              {property.preInstalledItems?.map((item, index) => (
                <li key={index}>✓ {item}</li>
              ))}
            </ul>

            {/* 4. Location Details */}
            <h3>Location Overview</h3>
            <p>{property.locationDescription}</p>

            {/* 5. Additional Distance Info */}
            <div className="distance-badge">
              🚆 ✈️ <strong>Proximity:</strong> {property.distanceInfo}
            </div>
          </div>

          <div className="side-pricing-card">
            {/* Price in Monthly Rent (INR) */}
            <h3>Rent Pricing</h3>
            <div className="price-tag">₹{property.price}</div>

            {/* Booking call & email details */}
            <div className="booking-box">
              <h4>Book Your Visit</h4>
              <p>For booking, call directly or email us at:</p>
              <p>📞 <strong>+91 7579030670</strong></p>
              <p>✉️ <strong>vs7579030670@gmail.com</strong></p>
            </div>
          </div>
        </div>

        {/* 6. Query Input Box before Footer */}
        <div className="query-section">
          <h3>Have Questions About This Property?</h3>
          <p>Submit your query and our team will get back to you via email.</p>
          {statusMsg && <p className="status-message">{statusMsg}</p>}

          <form onSubmit={handleQuerySubmit} className="query-form">
            <input
              type="email"
              placeholder="Your Email Address"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
            <textarea
              placeholder="Write your query here..."
              value={queryMessage}
              onChange={(e) => setQueryMessage(e.target.value)}
              rows="4"
              required
            ></textarea>
            <button type="submit">Submit Query</button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}