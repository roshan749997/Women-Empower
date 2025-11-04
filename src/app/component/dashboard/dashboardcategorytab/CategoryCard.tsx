"use client";

import React, { useState, useEffect } from "react";
import { MoreVertical, Eye, Edit2, Trash2 } from "lucide-react";
import { Category } from "@/app/types/dashboardcategory";
import { getFromR2 } from "@/app/lib/utils/r2Client";

interface CategoryCardProps {
  category: Category;
  onView: (category: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string, image: string) => void; // ✅ updated
}

export default function CategoryCard({
  category,
  onView,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false); // optional UX improvement

  useEffect(() => {
    async function fetchImage() {
      try {
        console.log("Fetching image for:", category.image);
        const url = await getFromR2(category.image);
        console.log("Fetched access URL:", url);
        setImageUrl(url);
      } catch (err) {
        console.error("❌ Failed to load image from R2:", err);
      }
    }

    if (category.image) {
      fetchImage();
    } else {
      console.warn("⚠️ category.image is empty:", category);
    }
  }, [category.image]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    setIsDeleting(true);
    try {
      onDelete(category.id, category.image); // ✅ now passing both
    } finally {
      setIsDeleting(false);
      setOpenDropdown(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-visible hover:shadow-lg transition relative">
      <div className="relative h-48">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={category.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
            Loading...
          </div>
        )}

        <div className="absolute top-2 right-2">
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full transition shadow-md"
          >
            <MoreVertical size={20} className="text-gray-700" />
          </button>

          {openDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <button
                onClick={() => {
                  onView(category);
                  setOpenDropdown(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 transition"
              >
                <Eye size={16} className="text-gray-600" />
                <span className="text-sm text-gray-700">View</span>
              </button>
              <button
                onClick={() => {
                  onEdit(category);
                  setOpenDropdown(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 transition"
              >
                <Edit2 size={16} className="text-blue-600" />
                <span className="text-sm text-gray-700">Edit</span>
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 transition rounded-b-lg disabled:opacity-50"
              >
                <Trash2 size={16} className="text-red-600" />
                <span className="text-sm text-gray-700">
                  {isDeleting ? "Deleting..." : "Delete"}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-center font-semibold text-gray-800">{category.name}</h3>
      </div>
    </div>
  );
}