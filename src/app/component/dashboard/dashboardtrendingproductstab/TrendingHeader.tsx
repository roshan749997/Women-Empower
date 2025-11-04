// components/TrendingHeader.tsx
'use client';
import React from "react";
import { TrendingUp } from "lucide-react";

interface TrendingHeaderProps {
  totalCount: number;
}

export const TrendingHeader: React.FC<TrendingHeaderProps> = ({ totalCount }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center gap-4">
        <div className="bg-orange-100 p-3 rounded-lg">
          <TrendingUp className="w-8 h-8 text-orange-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trending Products</h1>
          <p className="text-sm text-gray-600 mt-1">
            {totalCount} {totalCount === 1 ? 'product' : 'products'} currently trending
          </p>
        </div>
      </div>
    </div>
  );
};