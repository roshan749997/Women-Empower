// components/TrendingProductDrawer.tsx
'use client';
import React from "react";
import { X } from "lucide-react";
import { TrendingProduct } from "@/app/types/dashboardtrendingtab";
import { TrendingDrawerView } from "./TrendingDrawerView";

interface TrendingProductDrawerProps {
  showDrawer: boolean;
  selectedProduct: TrendingProduct | null;
  currentImageIndex: number;
  onClose: () => void;
  onNextImage: () => void;
  onPrevImage: () => void;
  onSetImageIndex: (index: number) => void;
}

export const TrendingProductDrawer: React.FC<TrendingProductDrawerProps> = ({
  showDrawer,
  selectedProduct,
  currentImageIndex,
  onClose,
  onNextImage,
  onPrevImage,
  onSetImageIndex,
}) => {
  return (
    <>
      {showDrawer && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-opacity-20 transition-all duration-300 ease-in-out z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] lg:w-[560px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          showDrawer ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
            <h2 className="text-xl font-semibold text-gray-900">Trending Product Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <TrendingDrawerView
              selectedProduct={selectedProduct}
              currentImageIndex={currentImageIndex}
              onNextImage={onNextImage}
              onPrevImage={onPrevImage}
              onSetImageIndex={onSetImageIndex}
            />
          </div>
        </div>
      </div>
    </>
  );
};