// app/components/ArtistDirectory.tsx (SSR Component)

import { Suspense } from "react";
import ArtistDirectoryContent from "./ArtistDirectoryContent";
import { getArtistsPaginated, getCategoriesApi } from "@/app/lib/api";
import { Artist } from "@/app/types/artist";

async function ArtistDirectoryWrapper() {
  // Server-side data fetching
  let artists: Artist[] = [];
  let categories: string[] = [];
  let totalPages = 1;
  let totalArtists = 0;

  try {
    // Fetch artists with pagination
    const artistsData = await getArtistsPaginated(1);
    artists = artistsData.data || [];
    totalPages = artistsData.totalPages || 1;
    totalArtists = artistsData.totalArtists || 0;

    // Fetch categories
    const categoriesData = await getCategoriesApi();
    categories = categoriesData?.map((cat: any) => cat.name) || [];
    
    // Create a category mapping object
    const categoryMap: { [key: string]: string } = {};
    categoriesData?.forEach((cat: any) => {
      categoryMap[cat.id] = cat.name;
    });
    
    // Map category names to artists
    artists = artists.map(artist => ({
      ...artist,
      category: categoryMap[artist.category_id] || 'Unknown Category'
    }));
    
  } catch (error) {
    console.error('Error fetching initial data:', error);
    // Fallback to empty arrays if API fails
  }

  return (
    <div className="bg-[#f1f2f4] py-2 sm:py-2 px-2 sm:px-4">
      <div className="min-h-screen bg-white">
        <Suspense fallback={<LoadingFallback />}>
          <ArtistDirectoryContent
            initialArtists={artists}
            initialCategories={categories}
            initialTotalPages={totalPages}
            initialTotalArtists={totalArtists}
          />
        </Suspense>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#61503c]"></div>
    </div>
  );
}

export default ArtistDirectoryWrapper;