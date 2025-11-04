"use client";

import React, { useRef, useState } from 'react';
import { Play, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';
import { Course } from '@/app/types/course';
import { CourseCard } from './CourseCard';

interface PopularCoursesClientProps {
  courses: Course[];
}

export const PopularCoursesClient = ({ courses }: PopularCoursesClientProps) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const firstChild = scrollContainerRef.current.children[0] as HTMLElement;
      const cardWidth = firstChild?.clientWidth || 0;
      const gap = 24; // gap-6 = 1.5rem = 24px
      const scrollAmount = cardWidth + gap;

      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });

      setCurrentIndex((prev) =>
        direction === "left"
          ? Math.max(0, prev - 1)
          : Math.min(courses.length - 1, prev + 1)
      );
    }
  };

  return (
    <div className="relative">
      {/* Left Button */}
      <button
        onClick={() => scroll("left")}
        disabled={currentIndex === 0}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full 
                   flex items-center justify-center shadow-md bg-white text-gray-700 
                   hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Scroll Left"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Right Button */}
      <button
        onClick={() => scroll("right")}
        disabled={currentIndex >= courses.length - 1}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full 
                   flex items-center justify-center shadow-md bg-white text-gray-700 
                   hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Scroll Right"
      >
        <ArrowRight className="w-5 h-5" />
      </button>

      {/* Courses Container */}
      <div className="px-0">
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm"
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};