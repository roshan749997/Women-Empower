"use client";

import React from "react";
import { Heart } from "lucide-react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface WishListHeaderProps {
  itemCount: number;
  onRemoveAll: () => void;
}

export const WishListHeader: React.FC<WishListHeaderProps> = ({ 
  itemCount, 
  onRemoveAll 
}) => {
  return (
    <div className="bg-white border-b border-gray-200 py-6 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-black flex items-center">
              <Heart className="w-6 h-6 mr-2 text-red-500 fill-red-500" />
              My Wishlist
            </h1>
            <p className="mt-1 text-gray-600">
              {itemCount} item{itemCount !== 1 ? "s" : ""} in your wishlist
            </p>
          </div>
          <button
            onClick={onRemoveAll}
            className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-600 rounded-sm hover:bg-red-200 transition-all duration-200 transform hover:scale-105"
          >
            <DeleteOutlineIcon fontSize="small" />
            Remove All
          </button>
        </div>
      </div>
    </div>
  );
};