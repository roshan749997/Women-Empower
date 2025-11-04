"use client";

import React from 'react';
import { Play, BookOpen } from 'lucide-react';
import { Course } from '@/app/types/course';
import { useCategoryDetails } from "../../hooks/useCategoryDetails";
import R2Image from "../dashboard/dashboardallproductstab/R2Image";
import { DEFAULT_THUMBNAIL } from "@/app/data/dashboardproductdata";

interface CourseCardProps {
  course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const originalPrice = parseFloat(course.price);
  const discountedPrice = (originalPrice * (1 - course.discount / 100)).toFixed(2);
  const { details, loading } = useCategoryDetails(course.category_id);

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group h-full flex flex-col">
      {/* Thumbnail */}
      <div className="relative overflow-hidden h-40 flex-shrink-0 bg-gray-200">
        <R2Image 
          src={course.thumbnail} 
          fallbackSrc={DEFAULT_THUMBNAIL}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0  transition-all duration-300 flex items-center justify-center">
          <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black bg-opacity-50 rounded-full p-3" />
        </div>

        {/* Popular Badge */}
        {course.isPopular && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Popular
          </div>
        )}

        {/* Price Tag */}
        <div className="absolute top-3 right-3 bg-white bg-opacity-95 backdrop-blur-sm rounded-xl px-3 py-2">
          <div className="flex items-center gap-1">
            <span className="text-xs text-green-600">₹</span>
            <span className="text-sm font-bold text-gray-900">{discountedPrice}</span>
          </div>
          {course.discount > 0 && (
            <div className="text-xs text-gray-500 line-through">₹{course.price}</div>
          )}
        </div>

        {/* Discount Badge */}
        {course.discount > 0 && (
          <div className="absolute bottom-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {course.discount}% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2 gap-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full truncate">
            {loading ? "Loading..." : (details?.name || course.category_id)}
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full flex-shrink-0">
            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
          </span>
        </div>

        <h3 className="font-bold text-base text-gray-900 mb-2 line-clamp-2 leading-tight h-12">
          {course.title}
        </h3>

        <div className="mb-3">
          <span className="text-sm text-gray-600 font-medium line-clamp-1">{course.course_coordinator}</span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed flex-1">
          {course.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{course.lessons} lessons</span>
          </div>
        </div>
      </div>
    </div>
  );
};
