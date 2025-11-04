"use client";
import React, { useState, useEffect, useRef } from "react";
// Material UI Icons
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

// ✅ Import reviews data from external file
import reviewsData from "@/app/data/reviewsData";

const CustomerReviews: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const reviewsPerPage = isMobile ? 1 : 3;
  const totalPages = Math.ceil(reviewsData.length / reviewsPerPage);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Auto-slide control
  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [totalPages]);

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 2000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const getCurrentReviews = () => {
    const startIndex = currentPage * reviewsPerPage;
    return reviewsData.slice(startIndex, startIndex + reviewsPerPage);
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) =>
        star <= rating ? (
          <StarIcon key={star} className="text-yellow-400 w-4 h-4" />
        ) : (
          <StarBorderIcon key={star} className="text-gray-300 w-4 h-4" />
        )
      )}
    </div>
  );

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (
        parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase()
      );
    }
    return parts[0].charAt(0).toUpperCase();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-[#f6f0e3] rounded-sm ">
      {/* Header */}
      <div className="mb-4 sm:mb-5 text-left">
        <h3 className="text-b text-2xl sm:text-2xl">Our Customer Reviews</h3>
      </div>

      {/* Reviews */}
      <div
        className={`grid gap-6 mb-8 transition-transform duration-700 ease-in-out`}
        style={{
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        {getCurrentReviews().map((review) => (
          <div
            key={`${review.id}-${currentPage}`}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-500 p-5 border border-gray-100 animate-slide-in"
            onMouseEnter={stopAutoSlide}   // ✅ Hover par stop
            onMouseLeave={startAutoSlide} // ✅ Hover hatne par resume
          >
            <FormatQuoteIcon className="text-[#61503c] mb-2 w-6 h-6" />
            <p className="text-gray-700 leading-relaxed mb-4">
              "{review.review}"
            </p>
            <div className="mb-3">{renderStars(review.rating)}</div>

            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#61503c] text-white font-bold text-sm">
                {getInitials(review.name)}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">
                  {review.name}
                </h4>
                <p className="text-xs text-gray-500">
                  Verified Customer • {review.date}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentPage
                ? "bg-[#61503c] scale-125"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CustomerReviews;
