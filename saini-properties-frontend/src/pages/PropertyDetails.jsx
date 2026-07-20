import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaPlane,
  FaTrain,
  FaArrowLeft,
  FaShareAlt,
  FaHeart,
  FaSpinner,
  FaInfoCircle,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./PropertyDetails.css";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State Management
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Touch Swipe State
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Inquiry Form State - Message Area Only
  const [message, setMessage] = useState(
    "Hi, I am interested in this property. Please contact me with more details."
  );
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(null);

  // Fetch Property Data
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`/api/properties/${id}`);
        setProperty(response.data);
      } catch (err) {
        console.error("Error fetching property details:", err);
        setError("Failed to load property details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  // Image Slider Logic
  const propertyImages =
    property?.images?.length > 0 ? property.images : ["/placeholder-property.jpg"];

  const handlePrevSlide = useCallback(() => {
    setActiveImage((prevIndex) =>
      prevIndex === 0 ? propertyImages.length - 1 : prevIndex - 1
    );
  }, [propertyImages.length]);

  const handleNextSlide = useCallback(() => {
    setActiveImage((prevIndex) =>
      prevIndex === propertyImages.length - 1 ? 0 : prevIndex + 1
    );
  }, [propertyImages.length]);

  // Auto-play slideshow timer
  useEffect(() => {
    if (!isAutoPlaying || propertyImages.length <= 1) return;
    const timer = setInterval(() => {
      handleNextSlide();
    }, 4000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, handleNextSlide, propertyImages.length]);

  // Touch handlers for mobile swiping
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNextSlide();
    } else if (isRightSwipe) {
      handlePrevSlide();
    }
  };

  // Keyboard Navigation for Slider
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handlePrevSlide();
      if (e.key === "ArrowRight") handleNextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevSlide, handleNextSlide]);

  // Handle Contact Inquiry Submission
  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormSuccess(null);

    try {
      await axios.post("/api/inquiries", {
        propertyId: id,
        message: message
      });
      setFormSuccess(
        "Your message has been sent successfully! We will contact you shortly."
      );
    } catch (err) {
      console.error("Error submitting inquiry:", err);
      setFormSuccess("Failed to send message. Please try again later.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Share Handler
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="homepage-wrapper">
        <Navbar />
        <div className="page-content-wrapper flex flex-col items-center justify-center py-20">
          <FaSpinner className="animate-spin text-4xl mb-4 text-[var(--color-primary)]" />
          <p className="text-lg font-medium text-[var(--color-muted)]">Fetching property details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="homepage-wrapper">
        <Navbar />
        <div className="page-content-wrapper flex flex-col items-center justify-center py-20 px-4">
          <div className="pd-card text-center max-w-md p-8 shadow-lg">
            <FaInfoCircle className="text-5xl text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-[var(--color-ink)]">
              Property Not Found
            </h2>
            <p className="text-[var(--color-muted)] mb-6">
              {error || "The property you are looking for does not exist or has been removed."}
            </p>
            <button
              onClick={() => navigate("/properties")}
              className="pd-btn-primary inline-flex items-center gap-2 py-2.5 px-6 font-semibold shadow-md"
            >
              <FaArrowLeft /> Back to Properties
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Destructure property object
  const {
    title = "Luxury Residence",
    location = "Location upon request",
    price = "N/A",
    type = "Rental",
    bedrooms = 0,
    bathrooms = 0,
    area = "N/A",
    description = "No description available for this property.",
    amenities = [],
    nearby = {
      airport: "15 km",
      railway: "5 km"
    }
  } = property;

  return (
    <div className="homepage-wrapper">
      <Navbar />

      <main className="page-content-wrapper">
        {/* Navigation & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="pd-card inline-flex items-center gap-2 py-2 px-4 font-medium text-sm text-[var(--color-ink)] shadow-sm hover:border-[var(--color-primary)]"
          >
            <FaArrowLeft /> Back
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`pd-card p-3 shadow-sm transition flex items-center justify-center ${
                isSaved ? "text-red-500 border-red-500" : "text-[var(--color-muted)] hover:text-red-500"
              }`}
              title="Save Property"
            >
              <FaHeart className={isSaved ? "fill-current" : ""} />
            </button>

            <button
              onClick={handleShare}
              className="pd-card p-3 shadow-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition relative"
              title="Share Property"
            >
              <FaShareAlt />
              {copied && (
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[var(--color-ink)] text-[var(--color-surface)] text-xs px-2.5 py-1 rounded-md shadow-md whitespace-nowrap">
                  Link Copied!
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Title & Header Section */}
        <div className="pd-card mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="inline-block bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                {type}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-ink)]">
                {title}
              </h1>
              <p className="flex items-center text-[var(--color-muted)] mt-2 text-sm sm:text-base">
                <FaMapMarkerAlt className="text-[var(--color-primary)] mr-2 shrink-0" />
                {location}
              </p>
            </div>

            <div className="md:text-right border-t md:border-t-0 pt-4 md:pt-0 border-[var(--color-border)]">
              <span className="text-xs text-[var(--color-muted)] uppercase tracking-wider block">Price / Rent</span>
              <div className="text-3xl font-black text-[var(--color-primary)]">
                ₹{typeof price === "number" ? price.toLocaleString("en-IN") : price}
                <span className="text-sm font-normal text-[var(--color-muted)]"> / month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Image Slideshow Section */}
        <div 
          className="mb-10 group select-none"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div 
            className="relative h-64 sm:h-[450px] md:h-[520px] w-full rounded-2xl overflow-hidden shadow-xl bg-black/90 border border-[var(--color-border)]"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="relative w-full h-full">
              {propertyImages.map((img, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                    index === activeImage ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${title} - Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                </div>
              ))}
            </div>

            {propertyImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevSlide}
                  aria-label="Previous photo"
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all duration-200 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 hover:scale-110 active:scale-95"
                >
                  <FaChevronLeft className="text-base sm:text-lg" />
                </button>

                <button
                  onClick={handleNextSlide}
                  aria-label="Next photo"
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all duration-200 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 hover:scale-110 active:scale-95"
                >
                  <FaChevronRight className="text-base sm:text-lg" />
                </button>
              </>
            )}

            <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-full font-medium border border-white/10 shadow-sm flex items-center gap-1.5">
              <span>{activeImage + 1}</span> / <span>{propertyImages.length}</span>
            </div>

            {propertyImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                {propertyImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeImage === idx
                        ? "w-6 bg-[var(--color-primary)]"
                        : "w-2 bg-white/60 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {propertyImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto mt-4 pb-2 scrollbar-none snap-x">
              {propertyImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative flex-shrink-0 w-20 sm:w-28 h-16 sm:h-20 rounded-xl overflow-hidden border-2 snap-start transition-all duration-200 ${
                    activeImage === index
                      ? "border-[var(--color-primary)] scale-95 shadow-md ring-2 ring-[var(--color-primary)]/40"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left / Main Details Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Key Specs Row */}
            <div className="pd-card grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <FaBed className="text-2xl text-[var(--color-primary)] mb-2" />
                <span className="text-xs text-[var(--color-muted)] font-medium">Bedrooms</span>
                <span className="text-base sm:text-lg font-bold text-[var(--color-ink)]">
                  {bedrooms} BHK
                </span>
              </div>
              <div className="flex flex-col items-center border-x border-[var(--color-border)]">
                <FaBath className="text-2xl text-[var(--color-primary)] mb-2" />
                <span className="text-xs text-[var(--color-muted)] font-medium">Bathrooms</span>
                <span className="text-base sm:text-lg font-bold text-[var(--color-ink)]">
                  {bathrooms} Baths
                </span>
              </div>
              <div className="flex flex-col items-center">
                <FaRulerCombined className="text-2xl text-[var(--color-primary)] mb-2" />
                <span className="text-xs text-[var(--color-muted)] font-medium">Total Area</span>
                <span className="text-base sm:text-lg font-bold text-[var(--color-ink)]">
                  {area} sq ft
                </span>
              </div>
            </div>

            {/* Description Section */}
            <div className="pd-card p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[var(--color-ink)] mb-4">
                Property Description
              </h2>
              <p className="text-[var(--color-muted)] leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {description}
              </p>
            </div>

            {/* Pre-installed Features & Amenities */}
            {amenities.length > 0 && (
              <div className="pd-card p-6 sm:p-8">
                <h2 className="text-xl font-bold text-[var(--color-ink)] mb-6">
                  Pre-installed Items & Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {amenities.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
                    >
                      <FaCheckCircle className="text-emerald-500 text-lg shrink-0" />
                      <span className="text-sm font-medium text-[var(--color-ink)]">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Proximity & Location Connectivity */}
            <div className="pd-card p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[var(--color-ink)] mb-6">
                Location & Connectivity Proximity
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                  <div className="p-3 bg-[var(--color-primary)] text-white rounded-xl shadow-md">
                    <FaPlane className="text-xl" />
                  </div>
                  <div>
                    <span className="text-xs text-[var(--color-muted)] font-medium block">
                      Nearest Airport
                    </span>
                    <span className="text-base font-bold text-[var(--color-ink)]">
                      {nearby.airport || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                  <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md">
                    <FaTrain className="text-xl" />
                  </div>
                  <div>
                    <span className="text-xs text-[var(--color-muted)] font-medium block">
                      Railway Station
                    </span>
                    <span className="text-base font-bold text-[var(--color-ink)]">
                      {nearby.railway || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: User Query / Inquiry Form Only */}
          <div className="space-y-6">
            <div className="pd-card p-6 sticky top-24">
              <h4 className="font-bold text-lg text-[var(--color-ink)] mb-4">
                Inquire About Property
              </h4>
              
              {formSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-green-500/10 text-green-600 text-xs leading-relaxed border border-green-500/20">
                  {formSuccess}
                </div>
              )}

              {/* Single Field Form for User Query */}
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-muted)] mb-1">
                    Your Query / Message
                  </label>
                  <textarea
                    name="message"
                    rows="5"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your query or message here..."
                    className="property-input w-full p-3 rounded-xl text-sm resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="pd-btn-primary w-full flex items-center justify-center gap-2 font-semibold py-3 px-4 shadow-md disabled:opacity-50"
                >
                  {formSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin" /> Sending...
                    </>
                  ) : (
                    "Submit Inquiry"
                  )}
                </button>
              </form>
            </div>

            <div className="pd-card p-4 text-xs text-[var(--color-muted)] flex items-start gap-3">
              <FaInfoCircle className="text-base shrink-0 mt-0.5 text-[var(--color-primary)]" />
              <span>
                All inquiries sent directly through our platform are verified and handled securely.
              </span>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetails;