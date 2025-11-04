// components/TrendingDrawerView.tsx
'use client';
import React from "react";
import { ChevronLeft, ChevronRight, Star, TrendingUp } from "lucide-react";
import { TrendingProduct } from "@/app/types/dashboardtrendingtab";
import { calculateDiscountedPrice, getAllImages } from "@/app/lib/utils/dashboardtrending-utils";
import { DEFAULT_THUMBNAIL } from "@/app/data/dashboardproductdata";
import R2Image from "../dashboardallproductstab/R2Image";
interface TrendingDrawerViewProps {
  selectedProduct: TrendingProduct | null;
  currentImageIndex: number;
  onNextImage: () => void;
  onPrevImage: () => void;
  onSetImageIndex: (index: number) => void;
}

export const TrendingDrawerView: React.FC<TrendingDrawerViewProps> = ({
  selectedProduct,
  currentImageIndex,
  onNextImage,
  onPrevImage,
  onSetImageIndex,
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
              currentImageIndex === index ? "border-orange-500" : "border-gray-200"
            }`}
          >
            <R2Image src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center gap-3">
        <TrendingUp className="w-5 h-5 text-orange-600 flex-shrink-0" />
        <p className="text-sm text-orange-800 font-medium">
          This product is currently trending and visible to all users
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Product Name</label>
          <p className="text-gray-900 mt-1 font-medium">{selectedProduct.p_Name}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Artist Name</label>
          <p className="text-gray-900 mt-1 font-medium">{selectedProduct.artist_name}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Category</label>
          <p className="text-gray-900 mt-1 capitalize">
            {selectedProduct.category_id?.replace("_", " ")}
          </p>
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
        <div>
          <label className="text-sm font-medium text-gray-700">Sold</label>
          <p className="text-gray-900 mt-1 font-medium">{selectedProduct.sell_count} units</p>
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
    </div>
  );
};
