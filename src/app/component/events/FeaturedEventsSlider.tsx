// app/events/FeaturedEventsSlider.tsx
"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import R2Image from "../dashboard/dashboardallproductstab/R2Image";
import { DEFAULT_THUMBNAIL } from "@/app/data/dashboardproductdata";

interface Event {
  id: string;
  e_image: string;
  category_id: string;
  title: string;
  description: string;
  date_time: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  keywords: string;
  banner: string;
}

interface FeaturedEventsSliderProps {
  featuredEvents: Event[];
  formatDate: (date: string) => string;
}

const FeaturedEventsSlider: React.FC<FeaturedEventsSliderProps> = ({ 
  featuredEvents, 
  formatDate 
}) => {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    if (featuredEvents.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % featuredEvents.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [featuredEvents.length]);

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % featuredEvents.length);
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);

  if (featuredEvents.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="relative h-80 md:h-85">
          <R2Image 
            src={featuredEvents[currentBanner]?.banner} 
            fallbackSrc={DEFAULT_THUMBNAIL}
            alt={featuredEvents[currentBanner]?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-200"></div>
          
          <div className="absolute inset-0 flex items-center">
            <div className="w-full px-8 md:px-12">
              <div className="max-w-2xl text-black">
                <h2 className="text-3xl font-bold mb-4">
                  {featuredEvents[currentBanner]?.title}
                </h2>
                <p className="text-lg md:text-xl mb-6">
                  {featuredEvents[currentBanner]?.description}
                </p>
                <div className="flex flex-wrap gap-4 text-sm mb-6 text-black">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    {formatDate(featuredEvents[currentBanner]?.date_time || '')}
                  </div>
                </div>
                <button className="bg-[#695946] hover:bg-[#61503c] text-white px-8 py-3 rounded-lg font-semibold flex items-center">
                  Register Now
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>

          {featuredEvents.length > 1 && (
            <>
              <button 
                onClick={prevBanner}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/30 text-black p-2 rounded-full backdrop-blur-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={nextBanner}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/30 text-black p-2 rounded-full backdrop-blur-sm"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {featuredEvents.length > 1 && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {featuredEvents.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentBanner(i)}
                  className={`w-3 h-3 rounded-full ${i === currentBanner ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedEventsSlider;
