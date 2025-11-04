// components/admin/BannerGrid.tsx
'use client';

import { useState } from 'react';
import { MoreVertical, Eye, Edit2, Trash2 } from 'lucide-react';
import { Banner } from  "@/app/types/dashboard-banner-tab";

interface Props {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => void;
  onPreview: (banner: Banner) => void;
  isLoading: boolean;
}

export default function BannerGrid({ banners, onEdit, onDelete, onPreview, isLoading }: Props) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleAction = (action: () => void) => {
    action();
    setOpenMenuId(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {banners.map((banner) => (
        <div 
          key={banner.id} 
          className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative"
        >
          <div className="aspect-video bg-gray-100 relative">
            <img 
              src={banner.img_url} 
              alt="Banner"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
              }}
            />
            
            {/* Three Dot Menu */}
            <div className="absolute top-2 right-2 z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMenu(banner.id);
                }}
                disabled={isLoading}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MoreVertical className="w-5 h-5 text-gray-700" />
              </button>
              
              {/* Dropdown Menu */}
              {openMenuId === banner.id && (
                <>
                  {/* Backdrop to close menu */}
                  <div 
                    className="fixed inset-0 z-30"
                    onClick={() => setOpenMenuId(null)}
                  />
                  
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-40"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleAction(() => onPreview(banner))}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                    >
                      <Eye className="w-4 h-4" />
                      View Preview
                    </button>
                    <button
                      onClick={() => handleAction(() => onEdit(banner))}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Banner
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={() => handleAction(() => onDelete(banner.id))}
                      className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-3 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Banner
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}