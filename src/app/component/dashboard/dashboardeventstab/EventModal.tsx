'use client';
import React from 'react';
import { X } from 'lucide-react';
import { EventModalView } from './EventModalView';
import { EventModalForm } from './EventModalForm';
import type { Event, EventFormData, ModalMode } from '@/app/types/dashboardeventtab';

interface EventModalProps {
  isOpen: boolean;
  mode: ModalMode;
  selectedEvent: Event | null;
  formData: EventFormData;
  setFormData: (data: EventFormData) => void;
  thumbnailPreview: string;
  setThumbnailPreview: (preview: string) => void;
  bannerPreview: string;
  setBannerPreview: (preview: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'thumbnail' | 'banner') => void;
  onSubmit: () => void;
  onClose: () => void;
  categoryOptions?: Array<{ id: string; name: string }>;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  mode,
  selectedEvent,
  formData,
  setFormData,
  thumbnailPreview,
  setThumbnailPreview,
  bannerPreview,
  setBannerPreview,
  onImageUpload,
  onSubmit,
  onClose,
  categoryOptions
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-20 transition-all z-50 flex justify-end">
      <div className="bg-white w-full sm:w-[500px] h-full sm:h-auto sm:max-h-[100vh] overflow-y-auto sm:rounded-lg animate-slide-in">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold capitalize">{mode} Event</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {mode === 'view' && selectedEvent ? (
            <EventModalView event={selectedEvent} />
          ) : (
            <EventModalForm
              formData={formData}
              setFormData={setFormData}
              thumbnailPreview={thumbnailPreview}
              setThumbnailPreview={setThumbnailPreview}
              bannerPreview={bannerPreview}
              setBannerPreview={setBannerPreview}
              onImageUpload={onImageUpload}
              onSubmit={onSubmit}
              onCancel={onClose}
              modalMode={mode}
              categoryOptions={categoryOptions}
            />
          )}
        </div>
      </div>
    </div>
  );
};