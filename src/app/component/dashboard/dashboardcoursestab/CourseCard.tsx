// components/CourseCard.tsx
"use client";
import React from "react";
import { MoreVertical, Eye, Edit2, Trash2, Tag } from "lucide-react";
import { Course } from "@/app/types/dashboardcoursetab";
import { calculateDiscountedPrice } from "@/app/lib/utils/dashboardcourse-utils";
import R2Image from "../dashboardallproductstab/R2Image";
import { DEFAULT_THUMBNAIL } from "@/app/data/dashboardproductdata";

interface CourseCardProps {
  course: Course;
  onView: (course: Course) => void;
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onView,
  onEdit,
  onDelete,
  isMenuOpen,
  onMenuToggle,
}) => {
  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100"
      data-course-id={course.id}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <R2Image
          src={course.thumbnail}
          fallbackSrc={DEFAULT_THUMBNAIL}
          alt={course.courseName}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Discount Badge */}
        {course.discount > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-lg">
            -{course.discount}% OFF
          </div>
        )}

        {/* Level Badge */}
        {course.level && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-lg">
            {course.level}
          </div>
        )}

        {/* Category Badge */}
        {course.category && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-md flex items-center gap-1.5 text-xs font-medium shadow-md">
            <Tag className="w-3 h-3 text-blue-600" />
            <span>{course.category}</span>
          </div>
        )}

        {/* Three Dots Menu */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMenuToggle();
            }}
            className="bg-white/95 backdrop-blur-sm hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-all duration-150 hover:shadow-xl hover:scale-110"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Course Name */}
        <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2 min-h-[3rem] group-hover:text-blue-600 transition-colors">
          {course.courseName}
        </h3>

        {/* Price Section */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">
              ₹
              {calculateDiscountedPrice(
                course.price,
                course.discount
              ).toLocaleString()}
            </span>
            {course.discount > 0 && (
              <span className="text-sm text-gray-400 line-through">
                ₹{course.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div
          className="fixed z-50 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200"
          style={{
            top: `${
              (
                document.querySelector(
                  `[data-course-id="${course.id}"]`
                ) as HTMLElement
              )?.getBoundingClientRect().top || 0
            }px`,
            left: `${
              ((
                document.querySelector(
                  `[data-course-id="${course.id}"]`
                ) as HTMLElement
              )?.getBoundingClientRect().right || 0) - 224
            }px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onView(course)}
            className="w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center gap-3 text-sm text-gray-700 transition-colors rounded-lg mx-1"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Eye className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-medium">View Details</span>
          </button>

          <button
            onClick={() => onEdit(course)}
            className="w-full text-left px-4 py-2.5 hover:bg-green-50 flex items-center gap-3 text-sm text-gray-700 transition-colors rounded-lg mx-1"
          >
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <Edit2 className="w-4 h-4 text-green-600" />
            </div>
            <span className="font-medium">Edit Course</span>
          </button>

          <div className="border-t border-gray-200 my-2 mx-2"></div>

          <button
            onClick={() => onDelete(course.id)}
            className="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-3 text-sm text-red-600 transition-colors rounded-lg mx-1"
          >
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-red-600" />
            </div>
            <span className="font-medium">Delete Course</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseCard;
