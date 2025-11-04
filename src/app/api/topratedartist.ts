import { Artist } from "../types/artist";
import { getArtistsApi } from "../lib/api";

// Fetch top rated artists from API
export const getTopRatedArtists = async (): Promise<Artist[]> => {
  try {
    const artists = await getArtistsApi(1); // Get first page
    // Since the API returns all artists, we'll consider all of them as top rated for now
    // In a real scenario, you might want to filter based on some criteria like rating or experience
    return artists || [];
  } catch (error) {
    console.error('Error fetching top rated artists:', error);
    // Return empty array as fallback
    return [];
  }
};