import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './PageLayout.css';

const reviews = [
  {
    quote: "The carpet-area breakdown on every listing saved us from a bad surprise other agencies never mentioned. Closed on our 3 BHK in under a month.",
    name: 'Rohit Malhotra',
    context: 'Bought a 3 BHK apartment',
  },
  {
    quote: "Rental management has been completely hands-off since we signed up. Tenant issues get resolved before we even hear about them.",
    name: 'Ayesha Khan',
    context: 'Rental client, 2 units',
  },
  {
    quote: "Legal support walked us through registration paperwork we'd never have understood on our own. Genuinely reassuring team.",
    name: 'David Fernandes',
    context: 'First-time home buyer',
  },
];

export default function Reviews() {
  return (
    <div className="page-layout-wrapper">
      <Navbar />
      <div className="page-content fade-in-up">
        <h1>Client <span>Reviews & Testimonials</span></h1>
        <p>See why buyers and families trust Saini Properties for their investments.</p>

        <div className="page-cards-grid">
          {reviews.map((review) => (
            <div className="review-card" key={review.name}>
              <div className="review-stars">★★★★★</div>
              <p className="review-quote">"{review.quote}"</p>
              <div className="review-author">
                <strong>{review.name}</strong>
                <span>{review.context}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
