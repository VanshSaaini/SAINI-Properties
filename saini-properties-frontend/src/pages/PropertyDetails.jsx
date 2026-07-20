import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaCheckCircle,
  FaPlane,
  FaTrain,
  FaArrowLeft,
  FaShareAlt,
  FaHeart,
  FaSpinner,
  FaShieldAlt,
  FaUser,
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
        "Your message has been sent successfully! An agent will contact you shortly."
      );
    } catch (err) {
      console.error("Error submitting inquiry:", err);
      setFormSuccess("Failed to send message. Please try again or contact directly.");
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
      <div className="homepage-wrapper flex flex-col min-h-screen justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-gray-700 dark:text-gray-200">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
          <p className="text-lg font-medium">Fetching property details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="homepage-wrapper flex flex-col min-h-screen justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <div className="text-center max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <FaInfoCircle className="text-5xl text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Property Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {error || "The property you are looking for does not exist or has been removed."}
            </p>
            <button
              onClick={() => navigate("/properties")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition duration-200 shadow-md"
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
    agent = {
      name: "Property Agent",
      phone: "+91 98765 43210",
      email: "contact@properties.com"
    },
    nearby = {
      airport: "15 km",
      railway: "5 km"
    }
  } = property;

  return (
    <div className="homepage-wrapper flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-8 text-gray-800 dark:text-gray-100 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Navigation & Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition"
            >
              <FaArrowLeft /> Back
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`p-3 rounded-xl border shadow-sm transition flex items-center justify-center ${
                  isSaved
                    ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-500"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-red-500"
                }`}
                title="Save Property"
              >
                <FaHeart className={isSaved ? "fill-current" : ""} />
              </button>

              <button
                onClick={handleShare}
                className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 transition relative"
                title="Share Property"
              >
                <FaShareAlt />
                {copied && (
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2.5 py-1 rounded-md shadow-md whitespace-nowrap">
                    Link Copied!
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Title & Header Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <span className="inline-block bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                  {type}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                  {title}
                </h1>
                <p className="flex items-center text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">
                  <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400 mr-2 shrink-0" />
                  {location}
                </p>
              </div>

              <div className="md:text-right border-t md:border-t-0 pt-4 md:pt-0 border-gray-100 dark:border-gray-700">
                <span className="text-xs text-gray-400 uppercase tracking-wider block">Price / Rent</span>
                <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
                  ₹{typeof price === "number" ? price.toLocaleString("en-IN") : price}
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400"> / month</span>
                </div>
              </div>
            </div>
          </div>

          {/* --- RESPONSIVE IMAGE SLIDESHOW SECTION --- */}
          <div 
            className="mb-10 group select-none"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div 
              className="relative h-64 sm:h-[450px] md:h-[520px] w-full rounded-2xl overflow-hidden shadow-xl bg-gray-950"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {/* Slide Images Container */}
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

              {/* Slider Controls */}
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

              {/* Photo Counter Badge */}
              <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-full font-medium border border-white/10 shadow-sm flex items-center gap-1.5">
                <span>{activeImage + 1}</span> / <span>{propertyImages.length}</span>
              </div>

              {/* Navigation Indicator Dots */}
              {propertyImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  {propertyImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        activeImage === idx
                          ? "w-6 bg-blue-500"
                          : "w-2 bg-white/60 hover:bg-white"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Preview Bar */}
            {propertyImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto mt-4 pb-2 scrollbar-none snap-x">
                {propertyImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative flex-shrink-0 w-20 sm:w-28 h-16 sm:h-20 rounded-xl overflow-hidden border-2 snap-start transition-all duration-200 ${
                      activeImage === index
                        ? "border-blue-600 scale-95 shadow-md ring-2 ring-blue-500/40"
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
              <div className="grid grid-cols-3 gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm text-center">
                <div className="flex flex-col items-center">
                  <FaBed className="text-2xl text-blue-600 dark:text-blue-400 mb-2" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Bedrooms</span>
                  <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    {bedrooms} BHK
                  </span>
                </div>
                <div className="flex flex-col items-center border-x border-gray-100 dark:border-gray-700">
                  <FaBath className="text-2xl text-blue-600 dark:text-blue-400 mb-2" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Bathrooms</span>
                  <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    {bathrooms} Baths
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <FaRulerCombined className="text-2xl text-blue-600 dark:text-blue-400 mb-2" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Area</span>
                  <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    {area} sq ft
                  </span>
                </div>
              </div>

              {/* Description Section */}
              <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Property Description
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {description}
                </p>
              </div>

              {/* Pre-installed Features & Amenities */}
              {amenities.length > 0 && (
                <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Pre-installed Items & Amenities
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {amenities.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700"
                      >
                        <FaCheckCircle className="text-emerald-500 text-lg shrink-0" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Proximity & Location Connectivity */}
              <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Location & Connectivity Proximity
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-blue-50/40 dark:bg-blue-950/20">
                    <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md">
                      <FaPlane className="text-xl" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium block">
                        Nearest Airport
                      </span>
                      <span className="text-base font-bold text-gray-900 dark:text-white">
                        {nearby.airport || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-emerald-50/40 dark:bg-emerald-950/20">
                    <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md">
                      <FaTrain className="text-xl" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium block">
                        Railway Station
                      </span>
                      <span className="text-base font-bold text-gray-900 dark:text-white">
                        {nearby.railway || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Contact Agent & Inquiry Form */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm sticky top-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-xl border-2 border-blue-500 shrink-0">
                    <FaUser />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      Property Agent
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                      <FaShieldAlt className="text-blue-500" /> Verified Agent
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {agent.phone && (
                    <a
                      href={`tel:${agent.phone}`}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition shadow-md"
                    >
                      <FaPhoneAlt /> {agent.phone}
                    </a>
                  )}
                  {agent.email && (
                    <a
                      href={`mailto:${agent.email}`}
                      className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold py-3 px-4 rounded-xl transition"
                    >
                      <FaEnvelope /> Send Direct Email
                    </a>
                  )}
                </div>

                <hr className="border-gray-100 dark:border-gray-700 my-6" />

                <h4 className="font-bold text-gray-900 dark:text-white mb-4">
                  Inquire About Property
                </h4>
                
                {formSuccess && (
                  <div className="mb-4 p-3 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs leading-relaxed border border-green-200 dark:border-green-800">
                    {formSuccess}
                  </div>
                )}

                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows="4"
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your inquiry message here..."
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900 dark:text-white"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition shadow-md disabled:opacity-50"
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

              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/40 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-3">
                <FaInfoCircle className="text-base shrink-0 mt-0.5" />
                <span>
                  All inquiries sent directly through our platform are verified and handled securely by assigned agents.
                </span>
              </div>

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetails;