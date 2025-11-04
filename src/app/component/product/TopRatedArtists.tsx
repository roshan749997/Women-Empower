import { getTopRatedArtists } from "@/app/api/topratedartist";
import { TopRatedArtistsClient } from '../TopRatedArtists/TopRatedArtistsClient';
import { Artist } from '@/app/types/artist';
import { getCategoriesApi } from '@/app/lib/api';

export const TopRatedArtists = async () => {
  // Fetch data on the server
  let artists: Artist[] = [];
  let error: string | null = null;

  try {
    artists = await getTopRatedArtists();
    
    // Fetch categories and map them to artists
    const categoriesData = await getCategoriesApi();
    const categoryMap: { [key: string]: string } = {};
    categoriesData?.forEach((cat: any) => {
      categoryMap[cat.id] = cat.name;
    });
    
    // Map category names to artists
    artists = artists.map(artist => ({
      ...artist,
      category: categoryMap[artist.category_id] || 'Unknown Category'
    }));
    
  } catch (err) {
    console.error('Error fetching top rated artists:', err);
    error = err instanceof Error ? err.message : 'Failed to fetch top rated artists';
  }

  return (
    <div className="bg-[#f1f2f4] py-2 sm:py-2 px-2 sm:px-4">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-5 bg-[#f6f0e3] rounded-sm">
        <section className="w-full max-w-7xl mx-auto">
          <div className="mb-4 sm:mb-5 text-left">
            <h2 className="text-black text-2xl sm:text-3xl font-bold">Top Rated Artists</h2>
          </div>

          {error ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Error loading top rated artists
              </h3>
              <p className="text-gray-600 mb-4">
                {error}
              </p>
              <a
                href="/"
                className="inline-block bg-[#61503c] text-white px-6 py-2 rounded-md hover:bg-[#7a5b3e] transition-all duration-200 transform hover:scale-105"
              >
                Try Again
              </a>
            </div>
          ) : artists.length > 0 ? (
            <TopRatedArtistsClient artists={artists} />
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No top rated artists found
              </h3>
              <p className="text-gray-600">
                Check back later for featured artists!
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};