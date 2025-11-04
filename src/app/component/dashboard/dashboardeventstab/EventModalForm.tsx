'use client';
import React, { useRef } from 'react';
import { X, ImageIcon, Upload } from 'lucide-react';
import { EVENT_CATEGORIES } from '@/app/data/dashboardeventsdata';
import type { EventFormData, ModalMode } from '@/app/types/dashboardeventtab';
import R2Image from "../dashboardallproductstab/R2Image";

interface EventModalFormProps {
  formData: EventFormData;
  setFormData: (data: EventFormData) => void;
  thumbnailPreview: string;
  setThumbnailPreview: (preview: string) => void;
  bannerPreview: string;
  setBannerPreview: (preview: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'thumbnail' | 'banner') => void;
  onSubmit: () => void;
  onCancel: () => void;
  modalMode: ModalMode;
  categoryOptions?: Array<{ id: string; name: string }>;
}

export const EventModalForm: React.FC<EventModalFormProps> = ({
  formData,
  setFormData,
  thumbnailPreview,
  setThumbnailPreview,
  bannerPreview,
  setBannerPreview,
  onImageUpload,
  onSubmit,
  onCancel,
  modalMode,
  categoryOptions
}) => {
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const addKeyword = (keyword: string) => {
    if (keyword && !formData.keywords?.includes(keyword)) {
      setFormData({ ...formData, keywords: [...(formData.keywords || []), keyword] });
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData({ ...formData, keywords: formData.keywords?.filter(k => k !== keyword) });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image</label>
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer"
          onClick={() => thumbnailInputRef.current?.click()}
        >
          {thumbnailPreview ? (
            <div className="relative">
              <R2Image src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-48 object-cover rounded-lg" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setThumbnailPreview('');
                  setFormData({ ...formData, thumbnail: '' });
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="py-8">
              <ImageIcon size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600 text-sm">Click to upload thumbnail</p>
              <p className="text-gray-400 text-xs mt-1">PNG, JPG up to 10MB</p>
            </div>
          )}
        </div>
        <input
          ref={thumbnailInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => onImageUpload(e, 'thumbnail')}
          className="hidden"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image (Optional)</label>
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer"
          onClick={() => bannerInputRef.current?.click()}
        >
          {bannerPreview ? (
            <div className="relative">
              <R2Image src={bannerPreview} alt="Banner preview" className="w-full h-32 object-cover rounded-lg" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setBannerPreview('');
                  setFormData({ ...formData, banner: '' });
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="py-6">
              <Upload size={36} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600 text-sm">Click to upload banner</p>
            </div>
          )}
        </div>
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => onImageUpload(e, 'banner')}
          className="hidden"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={categoryOptions && categoryOptions.length > 0
            ? (categoryOptions.find(c => c.name === (formData.category as string))?.id || '')
            : (formData.category as string) || ''}
          onChange={(e) => {
            const val = e.target.value;
            if (categoryOptions && categoryOptions.length > 0) {
              const found = categoryOptions.find(c => c.id === val);
              setFormData({ ...formData, category: found?.name || '' });
            } else {
              setFormData({ ...formData, category: val });
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a category</option>
          {(categoryOptions && categoryOptions.length > 0
            ? categoryOptions.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))
            : EVENT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              )))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Event title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          placeholder="Event description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
        <input
          type="datetime-local"
          value={formData.dateTime}
          onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            id="keywordInput"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add keyword"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const input = e.target as HTMLInputElement;
                addKeyword(input.value);
                input.value = '';
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.getElementById('keywordInput') as HTMLInputElement;
              addKeyword(input.value);
              input.value = '';
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.keywords?.map((keyword, idx) => (
            <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
              {keyword}
              <button onClick={() => removeKeyword(keyword)} className="hover:text-blue-900">
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {modalMode === 'add' ? 'Add Event' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};
