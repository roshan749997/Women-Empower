"use client";

import React, { useEffect, useState } from "react";
import { Briefcase, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { Artist } from "@/app/types/artist";
import R2Image from "../dashboard/dashboardallproductstab/R2Image";
import { DEFAULT_THUMBNAIL } from "@/app/data/dashboardproductdata";

interface ArtistCardProps {
  artist: Artist;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const router = useRouter();
  // Use state to avoid hydration mismatch with date formatting
  const [formattedDate, setFormattedDate] = useState<string>('');
  
  useEffect(() => {
    // Format date only on client side
    const joinDate = new Date(artist.joining_date);
    const date = joinDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    setFormattedDate(date);
  }, [artist.joining_date]);

  const handleCardClick = () => {
    router.push(`/artists-details?id=${artist.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full h-full border border-gray-100 cursor-pointer hover:scale-105"
    >
      {/* Artist Photo */}
      <div className="flex-shrink-0">
        <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-100 to-amber-50 ring-4 ring-amber-100">
          <R2Image
            src={artist.artist_profile_pic}
            fallbackSrc={DEFAULT_THUMBNAIL}
            alt={artist.artist_Name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Artist Info */}
      <div className="flex-grow flex flex-col justify-between text-center sm:text-left w-full">
        <div className="space-y-3">
          {/* Name and Category */}
          <div>
            <h3 className="font-bold text-xl text-gray-900 mb-1">
              {artist.artist_Name}
            </h3>
            <p className="text-amber-700 text-sm font-semibold bg-amber-50 inline-block px-3 py-1 rounded-full">
              {artist.category}
            </p>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm">
            {/* Experience */}
            <div className="flex items-center gap-2 text-gray-700">
              <Briefcase className="w-4 h-4 text-amber-600" />
              <span className="font-medium">{artist.experience} years experience</span>
            </div>
          </div>

          {/* Joining Date */}
          <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{formattedDate || 'Loading...'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
