// components/SearchControls.tsx
'use client';
import React, { useEffect, useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import { formatCategoryName } from "@/app/lib/utils/dashboardproduct-utils";
import { getArtistsApi, getCategoriesApi } from "@/app/lib/api";

interface SearchControlsProps {
  searchTerm: string;
  selectedCategory: string;
  selectedArtist: string;
  uniqueArtists: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onArtistChange: (value: string) => void;
  onAddProduct: () => void;
}

export const SearchControls: React.FC<SearchControlsProps> = ({
  searchTerm,
  selectedCategory,
  selectedArtist,
  uniqueArtists,
  onSearchChange,
  onCategoryChange,
  onArtistChange,
  onAddProduct,
}) => {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  useEffect(() => {
    getCategoriesApi().then((cats) => {
      setCategories(Array.isArray(cats) ? [{ id: "all", name: "all" }, ...cats] : [{ id: "all", name: "all" }]);
    }).catch(() => setCategories([{ id: "all", name: "all" }]));
  }, []);
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {formatCategoryName(cat.name)}
                </option>
              ))}
            </select>
          </div>

          {false && (
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
                value={selectedArtist}
                onChange={(e) => onArtistChange(e.target.value)}
              >
                {uniqueArtists.map((artist) => (
                  <option key={artist} value={artist}>
                    {artist === "all" ? "All Artists" : artist}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button
          onClick={onAddProduct}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors duration-150 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>
    </div>
  );
};