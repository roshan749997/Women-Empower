// components/DrawerViewMode.tsx
'use client';
import React from "react";
import { ChevronLeft, ChevronRight, Star, TrendingUp } from "lucide-react";
import { Product } from "@/app/types/dashboardproduct";
import { calculateDiscountedPrice, getAllImages } from "@/app/lib/utils/dashboardproduct-utils";
import { DEFAULT_THUMBNAIL } from "@/app/data/dashboardproductdata";
import R2Image from "./R2Image";

interface DrawerViewModeProps {
  selectedProduct: Product | null;
  currentImageIndex: number;
  onNextImage: () => void;
  onPrevImage: () => void;
  onSetImageIndex: (index: number) => void;
  onViewDetails: (id: string) => void;
  categoryNameMap?: Record<string, string>;
  artistNameMap?: Record<string, string>;
}

export const DrawerViewMode: React.FC<DrawerViewModeProps> = ({
  selectedProduct,
  currentImageIndex,
  onNextImage,
  onPrevImage,
  onSetImageIndex,
  onViewDetails,
  categoryNameMap,
  artistNameMap,
}) => {
  if (!selectedProduct) return null;

  const allImages = getAllImages(selectedProduct);
  const currentImage = allImages[currentImageIndex];

  return (
    <div className="space-y-6">
      <div className="relative">
        <R2Image
          src={currentImage}
          fallbackSrc={DEFAULT_THUMBNAIL}
          alt={selectedProduct.p_Name}
          className="w-full h-64 object-cover rounded-lg"
        />
        {allImages.length > 1 && (
          <>
            <button
              onClick={onPrevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-700 p-2 rounded-full shadow-md transition-all duration-150"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onNextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-700 p-2 rounded-full shadow-md transition-all duration-150"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {allImages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {allImages.map((img, index) => (
          <button
            key={index}
            onClick={() => onSetImageIndex(index)}
            className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
              currentImageIndex === index ? "border-blue-500" : "border-gray-200"
            }`}
          >
            <R2Image src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Product Name</label>
          <p className="text-gray-900 mt-1 font-medium">{selectedProduct.p_Name}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Artist Name</label>
          <p className="text-gray-900 mt-1 font-medium">{artistNameMap?.[selectedProduct.artist_id] || selectedProduct.artist_id}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Category</label>
          <p className="text-gray-900 mt-1 capitalize">{categoryNameMap?.[selectedProduct.category_id] || selectedProduct.category_id?.replace("_", " ")}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Original Price</label>
          <p className="text-gray-900 mt-1 font-semibold">
            ₹{selectedProduct.price.toLocaleString()}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Discount</label>
          <p className="text-gray-900 mt-1">
            {selectedProduct.discount}%
            {selectedProduct.discount > 0 && (
              <span className="text-sm text-green-600 block">
                Save ₹
                {(
                  selectedProduct.price -
                  calculateDiscountedPrice(selectedProduct.price, selectedProduct.discount)
                ).toLocaleString()}
              </span>
            )}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Final Price</label>
          <p className="text-gray-900 mt-1 font-bold text-lg text-green-600">
            ₹
            {calculateDiscountedPrice(
              selectedProduct.price,
              selectedProduct.discount
            ).toLocaleString()}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Rating</label>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-gray-900 font-medium">{selectedProduct.review_id}</span>
          </div>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Description</label>
        <p className="text-gray-900 mt-1 leading-relaxed">{selectedProduct.description}</p>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Specifications</label>
        <p className="text-gray-900 mt-1 leading-relaxed">{selectedProduct.specification}</p>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Status</label>
        <p className="text-gray-900 mt-1">
          {selectedProduct.isTrending ? (
            <span className="inline-flex items-center gap-1 text-orange-600 font-medium">
              <TrendingUp className="w-4 h-4" />
              Trending Product
            </span>
          ) : (
            <span className="text-gray-600">Regular Product</span>
          )}
        </p>
      </div>
    </div>
  );
};
