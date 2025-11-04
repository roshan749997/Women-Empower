export interface ArtistReview {
  id: string;
  artist_id: string;
  user_id: string;
  rating: number;
  rating_description: string;
  date: string; // API uses 'date' field
  created_at?: string; // Keep for backward compatibility
  updated_at?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateReviewRequest {
  artist_id: string;
  user_id: string;
  rating: number;
  rating_description: string;
}
