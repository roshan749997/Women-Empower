// components/Pagination.tsx
"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  isTransitioning: boolean;
  isMobile: boolean;
  goToPage: (page: number) => void;
  goToPrevPage: () => void;
  goToNextPage: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  isTransitioning,
  isMobile,
  goToPage,
  goToPrevPage,
  goToNextPage,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = isMobile ? 3 : 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const sidePages = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentPage - sidePages);
      let endPage = Math.min(totalPages, currentPage + sidePages);
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        if (startPage === 1) {
          endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        } else {
          startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
      }
      
      for (let i = startPage; i <= endPage; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
      <div className="text-sm text-gray-600">
        Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} products
      </div>

      <div className="flex justify-center items-center gap-2">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1 || isTransitioning}
          className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            currentPage === 1 || isTransitioning
              ? "text-gray-400 cursor-not-allowed opacity-50"
              : "text-gray-700 hover:bg-gray-100 hover:scale-105"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex gap-1">
          {getPageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              disabled={isTransitioning}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                currentPage === pageNum
                  ? "bg-[#61503c] text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages || isTransitioning}
          className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            currentPage === totalPages || isTransitioning
              ? "text-gray-400 cursor-not-allowed opacity-50"
              : "text-gray-700 hover:bg-gray-100 hover:scale-105"
          }`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;