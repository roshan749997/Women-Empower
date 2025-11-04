// components/artist/ArtistFormView.tsx
import { Upload, User } from 'lucide-react';
import { ArtistFormData } from '@/app/types/dashboard-artist-tab';
import R2Image from "../dashboardallproductstab/R2Image";

interface ArtistFormViewProps {
  formData: ArtistFormData;
  imagePreview: string;
  onFormChange: (data: Partial<ArtistFormData>) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  categoryOptions: Array<{ id: string; name: string }>;
}

export default function ArtistFormView({
  formData,
  imagePreview,
  onFormChange,
  onImageUpload,
  categoryOptions
}: ArtistFormViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Artist Image
        </label>
        <div className="flex flex-col items-center gap-4">
          <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
            {imagePreview ? (
              <R2Image 
                src={imagePreview} 
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <User size={48} className="text-gray-400" />
              </div>
            )}
          </div>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
            />
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition border border-gray-300">
              <Upload size={16} className="text-gray-600" />
              <span className="text-sm text-gray-700">Upload Image</span>
            </div>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Artist Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.artist_name}
          onChange={(e) => onFormChange({ artist_name: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter artist name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.category_id || ''}
          onChange={(e) => {
            const selectedId = e.target.value;
            const found = categoryOptions.find((c) => c.id === selectedId);
            onFormChange({ category_id: selectedId, category: found?.name || '' });
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select category</option>
          {categoryOptions.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Introduction <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.intro}
          onChange={(e) => onFormChange({ intro: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Enter artist introduction"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Joining Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={formData.joining_date}
          onChange={(e) => onFormChange({ joining_date: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Experience <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.experience}
          onChange={(e) => onFormChange({ experience: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., 5 years"
        />
      </div>

      
    </div>
  );
}
