"use client";
// app/courses/page.tsx
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useCourseManagement } from "../hooks/useCourseManagement";
import CourseCard from "../component/dashboard/dashboardcoursestab/CourseCard";
import CourseModal from "../component/dashboard/dashboardcoursestab/CourseModal";
import { getCoursesApi, getCategoriesApi } from "../lib/api";
import { Course } from "../types/dashboardcoursetab";

export default function CoursesPage() {
  const [categoryOptions, setCategoryOptions] = useState<Array<{ id: string; name: string }>>([]);
  const {
    courses,
    setCourses,
    isModalOpen,
    modalMode,
    openMenuId,
    formData,
    thumbnailPreview,
    openModal,
    closeModal,
    handleImageChange,
    handleImageRemove,
    handleSave,
    handleDelete,
    toggleMenu,
    setFormData,
  } = useCourseManagement([]);

  useEffect(() => {
    (async () => {
      try {
        const [coursesRaw, categories] = await Promise.all([
          getCoursesApi(),
          getCategoriesApi(),
        ]);
        const categoryIdToName: Record<string, string> = {};
        const cats = Array.isArray(categories) ? categories : [];
        setCategoryOptions(cats);
        cats.forEach((c: { id: string; name: string }) => {
          categoryIdToName[c.id] = c.name;
        });
        const mapped: Course[] = (coursesRaw || []).map((c: any) => ({
          id: c.id,
          thumbnail: c.thumbnail,
          courseName: c.title, // mapping to UI field
          coordinator: c.course_coordinator,
          category: categoryIdToName[c.category_id] || "Unknown",
          title: c.title,
          description: c.description,
          lessons: Number(c.lessons) || 0,
          level: (c.level || '').toLowerCase() === 'advance' ? 'Expert' : (c.level || 'Beginner'),
          price: Number(c.price) || 0,
          discount: Number(c.discount) || 0,
        }));
        setCourses(mapped);
      } catch (e) {
        console.error('Failed to load courses', e);
      }
    })();
  }, [setCourses]);

  return (
    <>
      <div className="min-h-screen bg-[#f3f4f6] p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6 bg-white shadow-md rounded-lg p-4 md:p-6">
  <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
  <button
    onClick={() => openModal('add')}
    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
  >
    <Plus size={20} />
    <span className="hidden sm:inline">Add New</span>
  </button>
</div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onView={() => openModal('view', course)}
                onEdit={() => openModal('edit', course)}
                onDelete={handleDelete}
                isMenuOpen={openMenuId === course.id}
                onMenuToggle={() => toggleMenu(course.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <CourseModal
        isOpen={isModalOpen}
        mode={modalMode}
        formData={formData}
        onClose={closeModal}
        onSave={handleSave}
        thumbnailPreview={thumbnailPreview}
        onImageChange={handleImageChange}
        onImageRemove={handleImageRemove}
        onFormChange={setFormData}
        categoryOptions={categoryOptions}
      />
    </>
  );
}
