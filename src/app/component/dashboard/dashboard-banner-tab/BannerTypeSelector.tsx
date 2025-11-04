// components/admin/BannerTypeSelector.tsx
'use client';

import { Banner, BannerType, BANNER_TYPE_CONFIG } from "@/app/types/dashboard-banner-tab";

interface Props {
  selectedType: BannerType;
  onSelectType: (type: BannerType) => void;
  banners: Banner[];
}

export default function BannerTypeSelector({ selectedType, onSelectType, banners }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Select Banner Type
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(Object.keys(BANNER_TYPE_CONFIG) as BannerType[]).map((type) => {
          const config = BANNER_TYPE_CONFIG[type];
          const count = banners.filter(b => b.type === type).length;
          const isSelected = selectedType === type;
          
          return (
            <button
              key={type}
              onClick={() => onSelectType(type)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {config.label}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {config.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {count} / {config.maxCount === Infinity ? '∞' : config.maxCount} banners
                  </p>
                </div>
                {isSelected && (
                  <div className="ml-2 w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}