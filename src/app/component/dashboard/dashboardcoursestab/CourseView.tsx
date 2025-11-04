// components/CourseView.tsx
'use client';
import React from 'react';
import R2Image from '../dashboardallproductstab/R2Image';
import { DEFAULT_THUMBNAIL } from '@/app/data/dashboardproductdata';
import { Course } from '@/app/types/dashboardcoursetab';

interface CourseViewProps {
  course: Course;
}

const CourseView: React.FC<CourseViewProps> = ({ course }) => {
  return (
    <div className="space-y-6">
      <R2Image 
        src={course.thumbnail} 
        fallbackSrc={DEFAULT_THUMBNAIL}
        alt={course.courseName} 
        className="w-full h-64 object-cover rounded-lg" 
      />
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-1">Course Name</h3>
          <p className="text-lg text-gray-900">{course.courseName}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-1">Coordinator</h3>
          <p className="text-lg text-gray-900">{course.coordinator}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-1">Category</h3>
            <p className="text-lg text-gray-900">{course.category}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-1">Level</h3>
            <p className="text-lg text-gray-900">{course.level}</p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-1">Title</h3>
          <p className="text-lg text-gray-900">{course.title}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-1">Description</h3>
          <p className="text-gray-900">{course.description}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-1">Lessons</h3>
          <p className="text-lg text-gray-900">{course.lessons}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-1">Price</h3>
          <p className="text-2xl font-bold text-gray-900">₹{course.price}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-1">Discount</h3>
          <p className="text-2xl font-bold text-green-600">{course.discount}%</p>
        </div>
      </div>
    </div>
  );
};

export default CourseView;
