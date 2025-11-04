// components/artist/ArtistModal.tsx
'use client';
import { X } from 'lucide-react';
import { Artist, ModalType, ArtistFormData } from '@/app/types/dashboard-artist-tab';
import ArtistFormView from './ArtistFormView';
import ArtistDetailView from './ArtistDetailView';
interface CategoryOption { id: string; name: string }

interface ArtistModalProps {
  isOpen: boolean;
  modalType: ModalType;
  selectedArtist: Artist | null;
  formData: ArtistFormData;
  imagePreview: string;
  onClose: () => void;
  onFormChange: (data: Partial<ArtistFormData>) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isFormValid: boolean;
  categoryOptions: CategoryOption[];
}

export default function ArtistModal({
  isOpen,
  modalType,
  selectedArtist,
  formData,
  imagePreview,
  onClose,
  onFormChange,
  onImageUpload,
  onSubmit,
  isFormValid,
  categoryOptions
}: ArtistModalProps) {
  if (!isOpen) return null;

  const getTitle = () => {
    switch (modalType) {
      case 'create': return 'Add New Artist';
      case 'edit': return 'Edit Artist';
      case 'view': return 'Artist Details';
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-end z-50">
      <div className="bg-white h-full w-full md:w-[500px] shadow-2xl overflow-y-auto animate-slideInRight">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {modalType === 'view' ? (
            <ArtistDetailView artist={selectedArtist} />
          ) : (
            <ArtistFormView
              formData={formData}
              imagePreview={imagePreview}
              onFormChange={onFormChange}
              onImageUpload={onImageUpload}
              categoryOptions={categoryOptions}
            />
          )}

          <div className="flex gap-3 mt-8">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              {modalType === 'view' ? 'Close' : 'Cancel'}
            </button>
            {modalType !== 'view' && (
              <button
                onClick={onSubmit}
                disabled={!isFormValid}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {modalType === 'create' ? 'Create' : 'Update'}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}