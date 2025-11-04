// components/artist/ArtistDetailView.tsx
import { Artist } from '@/app/types/dashboard-artist-tab';
import { formatDateLong } from '@/app/lib/utils/dashboardartist-utils';
import ArtistAvatar from './ArtistAvatar';

interface ArtistDetailViewProps {
  artist: Artist | null;
}

export default function ArtistDetailView({ artist }: ArtistDetailViewProps) {
  if (!artist) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center mb-6">
        <div className="border-4 border-blue-200 rounded-full shadow-lg">
          <ArtistAvatar 
            image={artist.image} 
            name={artist.artist_name} 
            size="md"
          />
        </div>
      </div>
      
      <div>
        <p className="text-sm text-gray-600 mb-1">Artist Name</p>
        <p className="text-xl font-semibold text-gray-800">{artist.artist_name}</p>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-1">Category</p>
        <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
          {artist.category}
        </span>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-1">Introduction</p>
        <p className="text-base text-gray-800">{artist.intro}</p>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-1">Joining Date</p>
        <p className="text-base text-gray-800">
          {formatDateLong(artist.joining_date)}
        </p>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-1">Experience</p>
        <p className="text-base text-gray-800">{artist.experience}</p>
      </div>

      
    </div>
  );
}