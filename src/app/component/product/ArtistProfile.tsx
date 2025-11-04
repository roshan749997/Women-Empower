"use client";

import React, { useState, useEffect } from "react";
import { getArtistDetailsApi, getCategoryDetailsApi } from "../../lib/api";
import { Artist } from "../../types/artist";
import R2Image from "../dashboard/dashboardallproductstab/R2Image";
import { DEFAULT_THUMBNAIL } from "@/app/data/dashboardproductdata";

interface ArtistProfileProps {
  artistId: string;
}

const ArtistProfile: React.FC<ArtistProfileProps> = ({ artistId }) => {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>("");

  useEffect(() => {
    const fetchArtistDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const artistData = await getArtistDetailsApi(artistId);
        setArtist(artistData);
      } catch (err) {
        console.error('Error fetching artist details:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch artist details');
      } finally {
        setLoading(false);
      }
    };

    if (artistId) {
      fetchArtistDetails();
    }
  }, [artistId]);

  // Resolve category name from artist data
  useEffect(() => {
    const resolveCategory = async () => {
      if (!artist) return;
      // Prefer category field if present
      const inline = (artist as any).category as string | undefined;
      if (inline && inline.trim() !== "") {
        setCategoryName(inline);
        return;
      }
      // Fallback: fetch category details by ID
      try {
        if (artist.category_id) {
          const cat = await getCategoryDetailsApi(artist.category_id);
          const name = (cat?.name || (cat?.category_name as string) || "").toString();
          setCategoryName(name || artist.category_id);
        }
      } catch (e) {
        console.warn("Failed to resolve category name for artist", e);
        setCategoryName(artist.category_id);
      }
    };
    resolveCategory();
  }, [artist]);

  // Format joining date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-[#f1f2f4] w-full">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full mx-4">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Artist Profile...</h2>
          <p className="text-gray-600">Please wait while we fetch the artist details</p>
        </div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="flex justify-center items-center bg-[#f1f2f4] w-full">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full mx-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Artist</h2>
          <p className="text-gray-600 mb-4">{error || 'Artist not found'}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f1f2f4] w-full py-2 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white overflow-hidden rounded-sm shadow-sm">
          <div className="bg-gradient-to-r from-gray-300 to-gray-100 h-32"></div>
          
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-6">
              <R2Image
                src={artist.artist_profile_pic}
                fallbackSrc={DEFAULT_THUMBNAIL}
                alt={artist.artist_Name}
                className="rounded-full w-32 h-32 sm:w-40 sm:h-40 object-cover border-4 border-white shadow-lg"
              />
              
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{artist.artist_Name}</h1>
                <p className="text-gray-600 mt-1">Category: {categoryName || artist.category_id}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Experience</h3>
                <p className="text-lg font-semibold text-gray-800">{artist.experience} years</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Member Since</h3>
                <p className="text-lg font-semibold text-gray-800">{formatDate(artist.joining_date)}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">About</h3>
              <p className="text-gray-700 leading-relaxed">{artist.introduction}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;
