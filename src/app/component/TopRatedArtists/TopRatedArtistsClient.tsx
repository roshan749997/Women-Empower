"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Artist } from "@/app/types/artist";
import { ArtistCard } from "./ArtistCard";

interface TopRatedArtistsClientProps {
  artists: Artist[];
}

export const TopRatedArtistsClient = ({ artists }: TopRatedArtistsClientProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [cardWidth, setCardWidth] = useState(400); // Default width
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update dimensions and check if mobile
  useEffect(() => {
    if (!isMounted) return;

    const updateDimensions = () => {
      if (scrollRef.current) {
        const container = scrollRef.current.parentElement;
        if (container) {
          const width = container.clientWidth;
          
          // Check if mobile view
          setIsMobile(width < 768);
          
          // Calculate card width based on container width
          if (width >= 768) {
            // Desktop view: 3 cards with 24px gap between them
            setCardWidth((width - 48) / 3);
          } else {
            // Mobile view: full width with some padding
            setCardWidth(width - 32);
          }
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isMounted]);

  // Check scroll position after dimensions are calculated
  useEffect(() => {
    if (isMounted && scrollRef.current) {
      checkScroll();
    }
  }, [isMounted, cardWidth]);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      // Calculate scroll amount based on card width and gap
      const scrollAmount = isMobile ? cardWidth : cardWidth + 24; // 24px gap on desktop
      
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div className="relative">
      {/* Left Button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full 
                   flex items-center justify-center shadow-lg bg-white text-gray-700 
                   hover:bg-amber-50 hover:text-amber-700 transition-all hover:scale-110"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Right Button */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full 
                   flex items-center justify-center shadow-lg bg-white text-gray-700 
                   hover:bg-amber-50 hover:text-amber-700 transition-all hover:scale-110"
          aria-label="Scroll Right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Artists Container */}
      <div className="overflow-hidden">
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto scroll-smooth py-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            // Center the first card on mobile
            paddingLeft: isMobile ? '16px' : '0',
            paddingRight: isMobile ? '16px' : '0'
          }}
        >
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="flex-shrink-0"
              style={{ width: `${cardWidth}px` }}
            >
              <ArtistCard artist={artist} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};