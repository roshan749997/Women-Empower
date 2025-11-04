// types/artist.ts
export interface Artist {
  id: string;
  artist_name: string;
  category: string;
  category_id?: string;
  intro: string;
  joining_date: string;
  experience: number | string;
  image?: string;
}

export type ModalType = 'create' | 'edit' | 'view';

export interface ArtistFormData {
  artist_name: string;
  category: string;
  intro: string;
  joining_date: string;
  experience: string | number;
  image: string;
  category_id?: string;
}

export const CATEGORIES = [
  'Rangoli',
  'Spiritual',
  'Resin',
  'Shubh Labh',
  'Lapdesk',
  'Diya & Thali',
  'Decor',
  'Gift'
] as const;