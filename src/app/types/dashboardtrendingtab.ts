// types/trending.ts
export interface TrendingProduct {
  id: string;
  p_Name: string;
  p_thumbnail: string;
  p_images: string[];
  category_id: string;
  artist_name: string;
  price: number;
  discount: number;
  review_id: string;
  sell_count: number;
  description: string;
  specification: string;
  isTrending: boolean;
}

export type TrendingDrawerMode = "view";