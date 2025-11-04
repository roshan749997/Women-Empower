// components/admin/BannerManagementClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Image } from 'lucide-react';
import { Banner, BannerType, BANNER_TYPE_CONFIG } from  "@/app/types/dashboard-banner-tab";
import { createBannerApi, updateBannerApi, deleteBannerApi } from '@/app/lib/bannerApi';
import BannerTypeSelector from './BannerTypeSelector';
import BannerGrid from './BannerGrid';
import BannerModal from './BannerModal';

interface Props {
  initialBanners: Banner[];
}

export default function BannerManagementClient({ initialBanners }: Props) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [selectedType, setSelectedType] = useState<BannerType>('home_banner');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'preview'>('add');
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredBanners = banners.filter(b => b.type === selectedType);
  const config = BANNER_TYPE_CONFIG[selectedType];
  const canAddMore = config.maxCount === Infinity || filteredBanners.length < config.maxCount;

  // Group banners by type for database format
  useEffect(() => {
    const grouped: Record<BannerType, string[]> = {
      home_banner: [],
      home_showcase: [],
      home_giftsection: []
    };
    
    banners.forEach(banner => {
      grouped[banner.type].push(banner.img_url);
    });
    
    console.log('Database Format:', grouped);
  }, [banners]);

  const handleCreate = async (img_url: string) => {
    setIsLoading(true);
    try {
      const newBanner = await createBannerApi({
        type: selectedType,
        img_url
      });
      setBanners([...banners, newBanner]);
      closeModal();
    } catch (error) {
      console.error('Error creating banner:', error);
      alert('Failed to create banner. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (img_url: string) => {
    if (!editingBanner) return;
    
    setIsLoading(true);
    try {
      const updated = await updateBannerApi(editingBanner.id, { img_url });
      setBanners(banners.map(b => b.id === editingBanner.id ? updated : b));
      closeModal();
    } catch (error) {
      console.error('Error updating banner:', error);
      alert('Failed to update banner. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    
    setIsLoading(true);
    try {
      await deleteBannerApi(id);
      setBanners(banners.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert('Failed to delete banner. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingBanner(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const openPreviewModal = (banner: Banner) => {
    setEditingBanner(banner);
    setModalMode('preview');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
    setModalMode('add');
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5]">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Banner Management
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your website banners and promotional content
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Type Selector */}
        <BannerTypeSelector
          selectedType={selectedType}
          onSelectType={setSelectedType}
          banners={banners}
        />

        {/* Banners List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {config.label}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Recommended size: {config.recommended}
                </p>
              </div>
              {canAddMore ? (
                <button
                  onClick={openAddModal}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                  Add Banner
                </button>
              ) : (
                <div className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg">
                  Maximum limit reached
                </div>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {filteredBanners.length === 0 ? (
              <div className="text-center py-12">
                <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No banners added yet</p>
                {canAddMore && (
                  <button
                    onClick={openAddModal}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-5 h-5" />
                    Add First Banner
                  </button>
                )}
              </div>
            ) : (
              <BannerGrid
                banners={filteredBanners}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onPreview={openPreviewModal}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <BannerModal
          mode={modalMode}
          banner={editingBanner}
          config={config}
          onClose={closeModal}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}