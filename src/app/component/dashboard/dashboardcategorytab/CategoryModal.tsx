"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  Category,
  ModalType,
  CategoryFormData,
} from "@/app/types/dashboardcategory";
import R2Image from "../dashboardallproductstab/R2Image";

interface CategoryModalProps {
  isOpen: boolean;
  modalType: ModalType;
  category: Category | null;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => void;
}

export default function CategoryModal({
  isOpen,
  modalType,
  category,
  onClose,
  onSubmit,
}: CategoryModalProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    image: "",
  });
  const [previewImage, setPreviewImage] = useState<string>("");

  useEffect(() => {
    if (category) {
      setFormData({ name: category.name, image: category.image });
      setPreviewImage(category.image);
    } else {
      setFormData({ name: "", image: "" });
      setPreviewImage("");
    }
  }, [category, isOpen]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-end z-50">
      <div className="bg-white h-full w-full md:w-[500px] shadow-2xl overflow-y-auto animate-slideInRight">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {modalType === "create" && "Add New Category"}
            {modalType === "edit" && "Edit Category"}
            {modalType === "view" && "View Category"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {modalType === "view" ? (
            <div className="space-y-6">
              <div>
                <R2Image
                  src={category?.image}
                  alt={category?.name}
                  className="w-full h-80 object-cover rounded-lg"
                />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Category Name</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {category?.name}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {previewImage ? (
                      <div className="space-y-4">
                        <R2Image
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <p className="text-sm text-blue-600 font-medium">
                          Click to change image
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-gray-400">
                          <svg
                            className="mx-auto h-12 w-12"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-600">
                          Click to upload image
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-8">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              {modalType === "view" ? "Close" : "Cancel"}
            </button>
            {modalType !== "view" && (
              <button
                onClick={handleSubmit}
                // backend uses a static image URL; only require name here
                disabled={!formData.name}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {modalType === "create" ? "Create" : "Update"}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
