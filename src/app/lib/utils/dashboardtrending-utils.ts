// utils/trending.ts
import { TrendingProduct } from "@/app/types/dashboardtrendingtab";
export const calculateDiscountedPrice = (price: number, discount: number): number => {
  return Math.round(price - (price * discount) / 100);
};

export const getAllImages = (product: TrendingProduct | null): string[] => {
  if (!product) return [];
  return [product.p_thumbnail, ...product.p_images].filter(img => img);
};