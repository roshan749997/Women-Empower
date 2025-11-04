// components/CourseModal.tsx
'use client';
import React from 'react';
import { X } from 'lucide-react';
import { Course, ModalMode } from '@/app/types/dashboardcoursetab';
import CourseForm from './CourseForm';
import CourseView from './CourseView';

interface CourseModalProps {
  isOpen: boolean;
  mode: ModalMode;
  formData: Course;
  thumbnailPreview: string;
  onClose: () => void;
  onSave: () => void;
  onFormChange: (data: Course) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  categoryOptions: Array<{ id: string; name: string }>;
}

const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  mode,
  formData,
  thumbnailPreview,
  onClose,
  onSave,
  onFormChange,
  onImageChange,
  onImageRemove,
  categoryOptions
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm bg-opacity-20 transition-all z-50 flex justify-end" 
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-2xl h-full overflow-y-auto animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'add' ? 'Add New Course' : mode === 'edit' ? 'Edit Course' : 'Course Details'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {mode === 'view' ? (
            <CourseView course={formData} />
          ) : (
            <CourseForm
              formData={formData}
              thumbnailPreview={thumbnailPreview}
              mode={mode}
              onFormChange={onFormChange}
              onImageChange={onImageChange}
              onImageRemove={onImageRemove}
              onSave={onSave}
              onCancel={onClose}
              categoryOptions={categoryOptions}
            />
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CourseModal;