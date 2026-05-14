"use client";

import React, { useState, useEffect } from "react";

/**
 * ScrollToTop Component
 * A floating button that appears after scrolling down, allowing users to return to the top smoothly.
 */
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Toggle visibility based on scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div 
      className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] transition-all duration-500 transform 
        ${isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-12 opacity-0 scale-50 pointer-events-none"}`}
    >
      <button
        onClick={scrollToTop}
        className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center 
          shadow-[0_20px_40px_-5px_rgba(56,189,248,0.5)] hover:bg-primary/90 
          hover:-translate-y-2 active:scale-95 transition-all group border border-white/20"
        aria-label="Return to top of page"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 transition-transform group-hover:-translate-y-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default ScrollToTop;
