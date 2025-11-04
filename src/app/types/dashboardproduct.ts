// types/dashboardproduct.ts
export interface Product {
  id: string;
  p_Name: string;
  thumbnail: string;
  p_images: string[];
  category_id: string;
  artist_id: string;
  price: number;
  discount: number;
  review_id: string;
  sell_count: number;
  description: string;
  specification: string;
  isTrending?: boolean;
}

export interface ProductFormData {
  p_Name: string;
  thumbnail: string;
  p_images: string[];
  category_id: string;
  artist_id: string;
  price: number;
  discount: number;
  description: string;
  specification: string;
}

export type DrawerMode = "add" | "edit" | "view";