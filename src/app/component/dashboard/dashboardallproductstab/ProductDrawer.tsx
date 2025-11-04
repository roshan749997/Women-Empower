// components/ProductDrawer.tsx
'use client';
import React from "react";
import { X } from "lucide-react";
import { DrawerMode, Product, ProductFormData } from "@/app/types/dashboardproduct";
import { DrawerViewMode } from "./DrawerViewMode";
import { DrawerFormMode } from "./DrawerFormMode";

interface ProductDrawerProps {
  showDrawer: boolean;
  drawerMode: DrawerMode;
  selectedProduct: Product | null;
  formData: ProductFormData;
  thumbnailPreview: string;
  imagePreview: string[];
  currentImageIndex: number;
  onClose: () => void;
  onSave: () => void;
  onInputChange: (field: keyof ProductFormData, value: string | number) => void;
  onThumbnailSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  onThumbnailUrlChange: (url: string) => void;
  onImageUrlChange: (url: string, index: number) => void;
  onRemoveThumbnail: () => void;
  onRemoveImage: (index: number) => void;
  onNextImage: () => void;
  onPrevImage: () => void;
  onSetImageIndex: (index: number) => void;
  onViewDetails: (id: string) => void;
}

export const ProductDrawer: React.FC<ProductDrawerProps> = ({
  showDrawer,
  drawerMode,
  selectedProduct,
  formData,
  thumbnailPreview,
  imagePreview,
  currentImageIndex,
  onClose,
  onSave,
  onInputChange,
  onThumbnailSelect,
  onImageSelect,
  onThumbnailUrlChange,
  onImageUrlChange,
  onRemoveThumbnail,
  onRemoveImage,
  onNextImage,
  onPrevImage,
  onSetImageIndex,
  onViewDetails,
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
            <h2 className="text-xl font-semibold text-gray-900">
              {drawerMode === "add"
                ? "Add New Product"
                : drawerMode === "edit"
                ? "Edit Product"
                : "Product Details"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {drawerMode === "view" ? (
              <DrawerViewMode
                selectedProduct={selectedProduct}
                currentImageIndex={currentImageIndex}
                onNextImage={onNextImage}
                onPrevImage={onPrevImage}
                onSetImageIndex={onSetImageIndex}
                onViewDetails={onViewDetails}
              />
            ) : (
              <DrawerFormMode
                formData={formData}
                thumbnailPreview={thumbnailPreview}
                imagePreview={imagePreview}
                onInputChange={onInputChange}
                onThumbnailSelect={onThumbnailSelect}
                onImageSelect={onImageSelect}
                onThumbnailUrlChange={onThumbnailUrlChange}
                onImageUrlChange={onImageUrlChange}
                onRemoveThumbnail={onRemoveThumbnail}
                onRemoveImage={onRemoveImage}
              />
            )}
          </div>

          {drawerMode !== "view" && (
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-white">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-150"
                disabled={
                  !formData.p_Name ||
                  !formData.category_id ||
                  !formData.artist_id ||
                  !formData.description
                }
              >
                {drawerMode === "add" ? "Add Product" : "Update Product"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};