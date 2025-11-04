
"use client";

import React, { useRef, useState, useEffect } from "react";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Category } from "@/app/types/category";
import { CategoryCard } from "./CategoryCard";

interface TopCategoriesClientProps {
  categories: Category[];
}

export const TopCategoriesClient = ({ categories }: TopCategoriesClientProps) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Scroll function
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const firstChild = scrollContainerRef.current.children[0] as HTMLElement;
      const cardWidth = firstChild?.clientWidth || 0;
      const gap = 24; // same as gap-6 (1.5rem)
      const scrollAmount = cardWidth + gap;

      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      
      // Check scroll position after animation
      setTimeout(checkScroll, 300);
    }
  };

  // Initial scroll check
  useEffect(() => {
    checkScroll();
  }, []);

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <button
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full 
                   flex items-center justify-center shadow-lg transition-all duration-200
                   ${canScrollLeft 
                     ? "bg-white text-gray-700 hover:bg-gray-100 hover:scale-110" 
                     : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
      >
        <ArrowBackIos fontSize="small" />
      </button>

      <button
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full 
                   flex items-center justify-center shadow-lg transition-all duration-200
                   ${canScrollRight 
                     ? "bg-white text-gray-700 hover:bg-gray-100 hover:scale-110" 
                     : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
      >
        <ArrowForwardIos fontSize="small" />
      </button>

      {/* Categories Container */}
      <div className="relative">
        <div 
          ref={scrollContainerRef} 
          className="overflow-x-auto scroll-smooth scrollbar-hide"
          onScroll={checkScroll}
        >
          <div className="flex gap-4 sm:gap-6 w-max py-4 px-2">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};