"use client";
import React, { useState } from "react";
import { Search, X } from "lucide-react";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-full relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>

      <input
        type="text"
        placeholder="Search anything..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="
          block w-full pl-12 pr-12 py-2.5
          rounded-full border border-gray-200
          bg-gray-50 text-gray-900 placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-100
          shadow-sm hover:shadow-md
          transition-all duration-300 ease-in-out
          text-sm font-medium
        "
      />

      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
