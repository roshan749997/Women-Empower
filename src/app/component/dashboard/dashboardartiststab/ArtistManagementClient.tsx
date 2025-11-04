// components/artist/ArtistManagementClient.tsx
'use client';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Artist } from '@/app/types/dashboard-artist-tab';
import { useArtistManager } from '@/app/hooks/useArtistManager';
import ArtistTable from './ArtistTable';
import ArtistModal from './ArtistModal';

export interface ArtistManagementClientProps {
  initialArtists: Artist[];
  pagination?: { currentPage: number; totalPages: number };
}

export default function ArtistManagementClient({ initialArtists, pagination }: ArtistManagementClientProps) {
  const {
    artists,
    isModalOpen,
    modalType,
    selectedArtist,
    formData,
    imagePreview,
    openDropdownId,
    isFormValid,
    categoryOptions,
    openModal,
    closeModal,
    handleImageUpload,
    handleFormChange,
    handleSubmit,
    handleDelete,
    toggleDropdown
  } = useArtistManager(initialArtists);

  return (
    <div className="min-h-screen bg-[#f2f3f5] p-6">
      <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8 bg-white shadow-md rounded-lg p-4 md:p-6">
  <h1 className="text-3xl md:text-3xl text-gray-900">Artist Management</h1>
  <button
    onClick={() => openModal('create')}
    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
  >
    <Plus size={20} />
    <span className="hidden sm:inline">Add Artist</span>
  </button>
</div>

        <ArtistTable
          artists={artists}
          onView={(artist) => openModal('view', artist)}
          onEdit={(artist) => openModal('edit', artist)}
          onDelete={handleDelete}
          openDropdownId={openDropdownId}
          onToggleDropdown={toggleDropdown}
        />

        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            {/* Prev */}
            <Link
              href={`?page=${Math.max(1, pagination.currentPage - 1)}`}
              className={`px-3 py-2 rounded-md text-sm ${pagination.currentPage <= 1 ? 'pointer-events-none opacity-50 bg-gray-100 text-gray-400' : 'bg-white border hover:bg-gray-50'}`}
            >
              Prev
            </Link>
            {/* Pages */}
            {Array.from({ length: pagination.totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = pageNum === pagination.currentPage;
              return (
                <Link
                  key={pageNum}
                  href={`?page=${pageNum}`}
                  className={`px-3 py-2 rounded-md text-sm border ${isActive ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50'}`}
                >
                  {pageNum}
                </Link>
              );
            })}
            {/* Next */}
            <Link
              href={`?page=${Math.min(pagination.totalPages, pagination.currentPage + 1)}`}
              className={`px-3 py-2 rounded-md text-sm ${pagination.currentPage >= pagination.totalPages ? 'pointer-events-none opacity-50 bg-gray-100 text-gray-400' : 'bg-white border hover:bg-gray-50'}`}
            >
              Next
            </Link>
          </div>
        )}

        <ArtistModal
          isOpen={isModalOpen}
          modalType={modalType}
          selectedArtist={selectedArtist}
          formData={formData}
          imagePreview={imagePreview}
          onClose={closeModal}
          onFormChange={handleFormChange}
          onImageUpload={handleImageUpload}
          onSubmit={handleSubmit}
          isFormValid={isFormValid}
          categoryOptions={categoryOptions}
        />
      </div>
    </div>
  );
}