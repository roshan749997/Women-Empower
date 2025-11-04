// lib/data/artists.ts
import { Artist } from "../types/dashboard-artist-tab";

// Deprecated: static artists removed; use /v1/artist/ API instead.
export {};

// Server-side function to fetch artists
export async function getArtists(): Promise<Artist[]> {
  // In production, this would fetch from a database
  // For now, returning initial data
  return []; // Return an empty array as initial artists are removed
}

// Server-side function to get a single artist
export async function getArtistById(id: number): Promise<Artist | null> {
  const artists = await getArtists();
  return null; // No single artist data available
}