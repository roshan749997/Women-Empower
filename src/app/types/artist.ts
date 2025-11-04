export interface Artist {
  id: string;
  artist_Name: string;
  artist_profile_pic: string;
  category_id: string;
  category: string;
  introduction?: string;
  joining_date: string;
  experience: number;
}

export interface ArtistApiResponse {
  success: boolean;
  message: string;
  data: {
    totalArtists: number;
    totalPages: number;
    currentPage: number;
    data: Artist[];
  };
}

export interface ArtistSearchResponse {
  success: boolean;
  data: Artist[];
}

export interface ArtistDetailsResponse {
  success: boolean;
  message: string;
  data: Artist;
}

export interface ArtistFilterRequest {
  categories?: string[];
  experience?: {
    minExp: number;
    maxExp: number;
  };
}