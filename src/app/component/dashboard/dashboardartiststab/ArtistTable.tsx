// components/artist/ArtistTable.tsx
'use client';
import { MoreVertical, Eye, Edit2, Trash2 } from 'lucide-react';
import { Artist,ModalType } from '@/app/types/dashboard-artist-tab';
import { formatDate } from '@/app/lib/utils/dashboardartist-utils';
import ArtistAvatar from './ArtistAvatar';

interface ArtistTableProps {
  artists: Artist[];
  onView: (artist: Artist) => void;
  onEdit: (artist: Artist) => void;
  onDelete: (id: string | number) => void;
  openDropdownId: number | null;
  onToggleDropdown: (id: string | number) => void;
}

export default function ArtistTable({
  artists,
  onView,
  onEdit,
  onDelete,
  openDropdownId,
  onToggleDropdown
}: ArtistTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Artist Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                Joining Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                Experience
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {artists.map((artist) => (
              <tr key={artist.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <ArtistAvatar image={artist.image} name={artist.artist_name} size="sm" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {artist.artist_name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {artist.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                  {formatDate(artist.joining_date)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                  {artist.experience}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="relative inline-block">
                    <button
                      onClick={() => onToggleDropdown(artist.id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                      <MoreVertical size={20} className="text-gray-600" />
                    </button>
                    
                    {openDropdownId === artist.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <button
                          onClick={() => onView(artist)}
                          className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 transition"
                        >
                          <Eye size={16} className="text-gray-600" />
                          <span className="text-sm text-gray-700">View</span>
                        </button>
                        <button
                          onClick={() => onEdit(artist)}
                          className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 transition"
                        >
                          <Edit2 size={16} className="text-blue-600" />
                          <span className="text-sm text-gray-700">Edit</span>
                        </button>
                        <button
                          onClick={() => onDelete(artist.id)}
                          className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 transition rounded-b-lg"
                        >
                          <Trash2 size={16} className="text-red-600" />
                          <span className="text-sm text-gray-700">Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
