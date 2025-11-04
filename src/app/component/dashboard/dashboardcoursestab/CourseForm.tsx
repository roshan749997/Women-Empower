// components/CourseForm.tsx
'use client';
import React from 'react';
import { X } from 'lucide-react';
import { Course, ModalMode } from '@/app/types/dashboardcoursetab';
import R2Image from "../dashboardallproductstab/R2Image";

interface CourseFormProps {
  formData: Course;
  thumbnailPreview: string;
  mode: ModalMode;
  onFormChange: (data: Course) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  onSave: () => void;
  onCancel: () => void;
  categoryOptions: Array<{ id: string; name: string }>;
}

const CourseForm: React.FC<CourseFormProps> = ({
  formData,
  thumbnailPreview,
  mode,
  onFormChange,
  onImageChange,
  onImageRemove,
  onSave,
  onCancel,
  categoryOptions
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Course Thumbnail *
        </label>
        <div className="flex flex-col gap-3">
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="hidden"
              id="thumbnail-upload"
            />
            <label
              htmlFor="thumbnail-upload"
              className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </label>
          </div>
          {thumbnailPreview && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
              <R2Image src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
              <button
                onClick={onImageRemove}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Course Name *</label>
        <input
          type="text"
          value={formData.courseName}
          onChange={(e) => onFormChange({...formData, courseName: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter course name"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Course Coordinator *</label>
        <input
          type="text"
          value={formData.coordinator}
          onChange={(e) => onFormChange({...formData, coordinator: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter coordinator name"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
          <select
            value={categoryOptions.find(c => c.name === formData.category)?.id || ''}
            onChange={(e) => {
              const selectedId = e.target.value;
              const found = categoryOptions.find(c => c.id === selectedId);
              const next = { ...formData, category: found?.name || '' };
              // We store only label in Course, backend id is resolved in handleSave
              onFormChange(next);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Category</option>
            {categoryOptions.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Level</label>
          <select
            value={formData.level}
            onChange={(e) => onFormChange({...formData, level: e.target.value as any})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => onFormChange({...formData, title: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter course title"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => onFormChange({...formData, description: e.target.value})}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter course description"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Lessons</label>
          <input
            type="number"
            value={formData.lessons}
            onChange={(e) => onFormChange({...formData, lessons: parseInt(e.target.value) || 0})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => onFormChange({...formData, price: parseInt(e.target.value) || 0})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Discount (%)</label>
          <input
            type="number"
            max="100"
            value={formData.discount}
            onChange={(e) => onFormChange({...formData, discount: parseInt(e.target.value) || 0})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onSave}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
        >
          {mode === 'add' ? 'Add Course' : 'Update Course'}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CourseForm;
