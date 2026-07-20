import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaPlane,
  FaTrain,
  FaShareAlt,
  FaSpinner,
  FaInfoCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { propertiesData } from "../data/propertiesData";
import API from "../services/authService"; // Custom Axios instance pointing to backend
import "./PropertyDetails.css";

const PropertyDetails = () => {
  const { id } = useParams();

  // State Management
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Touch Swipe State
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Inquiry Form State
  const [message, setMessage] = useState(
    "Hi, I am interested in this property. Please contact me with more details."
  );
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(null);

  // Fetch Property Data with Local Data Fallback
  useEffect(() => {
    setActiveImage(0);
    setFormSuccess(null);

    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Try API Request
        const response = await API.get(`/api/properties/${id}`);

        // Ensure API response actually contains property data
        if (
          response.data &&
          (response.data.id || response.data.name || response.data.title)
        ) {
          setProperty(response.data);
          return;
        }

        throw new Error("API returned empty property payload");
      } catch (err) {
        // 2. Fallback to local propertiesData array matching ID
        const localMatch = propertiesData.find(
          (p) => String(p.id) === String(id)
        );

        if (localMatch) {
          setProperty(localMatch);
        } else {
          setError(
            "Failed to load property details. The property may not exist."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  // Handle Images Array
  const propertyImages =
    property?.images?.length > 0
      ? property.images
      : property?.image
      ? [property.image]
      : ["/placeholder-property.jpg"];

  // Image Navigation Controls
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

  // Slideshow Auto-play Timer
  useEffect(() => {
    if (!isAutoPlaying || propertyImages.length <= 1) return;
    const timer = setInterval(() => {
      handleNextSlide();
    }, 4000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, handleNextSlide, propertyImages.length]);

  // Touch Gestures for Mobile
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

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handlePrevSlide();
      if (e.key === "ArrowRight") handleNextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevSlide, handleNextSlide]);

  // Submit Inquiry Form
  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormSuccess(null);

    try {
      await API.post("/api/contact-query", {
          propertyId: id,
          propertyName: property.name,
          userEmail: "", // collect from user if needed
          targetEmail: "",
          message,
      });
      setFormSuccess(
        "Your message has been sent successfully! We will contact you shortly."
      );
    } catch (err) {
      console.warn("Backend error or connection missing:", err);
      setFormSuccess(
        "Inquiry submitted! (Demo mode: Backend connection unavailable)."
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  // Share Property Action
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
          <p className="text-lg font-medium text-[var(--color-muted)]">
            Loading property details...
          </p>
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
              {error || "The property you are looking for does not exist."}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Extract property attributes safely
  const name = property.name || property.title || "Luxury Property";
  const location = property.location || "Location unavailable";
  const rawPrice = property.price || "N/A";
  const formattedPrice =
    typeof rawPrice === "number"
      ? `₹${rawPrice.toLocaleString("en-IN")}`
      : rawPrice.startsWith("₹")
      ? rawPrice
      : `₹${rawPrice}`;

  const badge = property.badge;
  const beds = property.beds ?? "N/A";
  const baths = property.baths ?? "N/A";
  const area = property.area || "N/A";
  const description = property.description || "No description available.";
  
  const preInstalledItems = Array.isArray(property.preInstalledItems)
    ? property.preInstalledItems
    : Array.isArray(property.amenities)
    ? property.amenities
    : [];

  const locationDescription = property.locationDescription;
  const distanceInfo = property.distanceInfo || "10 - 15 minutes away";

  return (
    <div className="homepage-wrapper">
      <Navbar />

      <main className="page-content-wrapper">
        {/* Right-Positioned Standard Share Button */}
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={handleShare}
            className="pd-card flex items-center gap-2 px-4 py-2 shadow-sm text-[var(--color-ink)] hover:text-[var(--color-primary)] transition relative font-medium text-sm border border-[var(--color-border)] rounded-md cursor-pointer"
            title="Share Property"
          >
            <FaShareAlt className="text-sm" />
            <span>Share</span>
            {copied && (
              <span className="absolute -top-9 right-0 bg-[var(--color-ink)] text-[var(--color-surface)] text-xs px-2.5 py-1 rounded-md shadow-md whitespace-nowrap z-30">
                Link Copied!
              </span>
            )}
          </button>
        </div>

        {/* Title & Price Card Header */}
        <div className="pd-card mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              {badge && (
                <span className="inline-block bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                  {badge}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-ink)]">
                {name}
              </h1>
              <p className="flex items-center text-[var(--color-muted)] mt-2 text-sm sm:text-base">
                <FaMapMarkerAlt className="text-[var(--color-primary)] mr-2 shrink-0" />
                {location}
              </p>
            </div>

            <div className="md:text-right border-t md:border-t-0 pt-4 md:pt-0 border-[var(--color-border)]">
              <span className="text-xs text-[var(--color-muted)] uppercase tracking-wider block">
                Price / Rent
              </span>
              <div className="text-3xl font-black text-[var(--color-primary)]">
                {formattedPrice}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Image Gallery */}
        <div
          className="mb-8 group select-none"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div
            className="relative h-64 sm:h-[450px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-xl bg-black/90 border border-[var(--color-border)]"
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
                    alt={`${name} - View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
                </div>
              ))}
            </div>

            {propertyImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevSlide}
                  aria-label="Previous photo"
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 hover:scale-110 active:scale-95"
                >
                  <FaChevronLeft className="text-base sm:text-lg" />
                </button>

                <button
                  onClick={handleNextSlide}
                  aria-label="Next photo"
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 hover:scale-110 active:scale-95"
                >
                  <FaChevronRight className="text-base sm:text-lg" />
                </button>
              </>
            )}

            {/* Counter Badge */}
            <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium border border-white/10 shadow-sm flex items-center gap-1">
              <span>{activeImage + 1}</span> / <span>{propertyImages.length}</span>
            </div>

            {/* Pagination Dots */}
            {propertyImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                {propertyImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    aria-label={`Go to image ${idx + 1}`}
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

          {/* Thumbnail Strip */}
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

        {/* Content Section Container Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Specs Card */}
            <div className="pd-card grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <FaBed className="text-2xl text-[var(--color-primary)] mb-2" />
                <span className="text-xs text-[var(--color-muted)] font-medium">
                  Bedrooms
                </span>
                <span className="text-base sm:text-lg font-bold text-[var(--color-ink)]">
                  {beds} Beds
                </span>
              </div>
              <div className="flex flex-col items-center border-x border-[var(--color-border)]">
                <FaBath className="text-2xl text-[var(--color-primary)] mb-2" />
                <span className="text-xs text-[var(--color-muted)] font-medium">
                  Bathrooms
                </span>
                <span className="text-base sm:text-lg font-bold text-[var(--color-ink)]">
                  {baths} Baths
                </span>
              </div>
              <div className="flex flex-col items-center">
                <FaRulerCombined className="text-2xl text-[var(--color-primary)] mb-2" />
                <span className="text-xs text-[var(--color-muted)] font-medium">
                  Area
                </span>
                <span className="text-base sm:text-lg font-bold text-[var(--color-ink)]">
                  {area}
                </span>
              </div>
            </div>

            {/* Description Container */}
            <div className="pd-card p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[var(--color-ink)] mb-4">
                Description
              </h2>
              <p className="text-[var(--color-muted)] leading-relaxed text-sm sm:text-base">
                {description}
              </p>
              {locationDescription && (
                <p className="text-[var(--color-muted)] leading-relaxed text-sm sm:text-base mt-4 pt-4 border-t border-[var(--color-border)]">
                  {locationDescription}
                </p>
              )}
            </div>

            {/* Pre-installed Items Container */}
            {preInstalledItems.length > 0 && (
              <div className="pd-card p-6 sm:p-8">
                <h2 className="text-xl font-bold text-[var(--color-ink)] mb-6">
                  Pre-installed Items & Features
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {preInstalledItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
                    >
                      <FaCheckCircle className="text-emerald-500 text-base shrink-0" />
                      <span className="text-sm font-medium text-[var(--color-ink)]">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Distance & Proximity Container */}
            <div className="pd-card p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[var(--color-ink)] mb-6">
                Connectivity & Distance Info
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex items-center gap-4 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                  <div className="p-3 bg-[var(--color-primary)] text-white rounded-xl shadow-md">
                    <FaPlane className="text-xl" />
                  </div>
                  <div>
                    <span className="text-xs text-[var(--color-muted)] font-medium block">
                      Airport Proximity
                    </span>
                    <span className="text-sm font-bold text-[var(--color-ink)]">
                      {distanceInfo}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                  <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md">
                    <FaTrain className="text-xl" />
                  </div>
                  <div>
                    <span className="text-xs text-[var(--color-muted)] font-medium block">
                      Railway Proximity
                    </span>
                    <span className="text-sm font-bold text-[var(--color-ink)]">
                      {distanceInfo}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="space-y-6">
            <div className="pd-card p-6 sticky top-24">
              <h3 className="font-bold text-lg text-[var(--color-ink)] mb-4">
                Inquire About Property
              </h3>

              {formSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-green-500/10 text-green-600 text-xs leading-relaxed border border-green-500/20">
                  {formSuccess}
                </div>
              )}

              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-muted)] mb-1">
                    Your Message
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
                  className="pd-btn-primary w-full flex items-center justify-center gap-2 font-semibold py-3 px-4 shadow-md disabled:opacity-50 cursor-pointer text-sm"
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
                All inquiries sent directly through our platform are verified
                and handled securely.
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