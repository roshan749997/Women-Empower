import { Product } from "../types/product";
import { getBestSellerProducts } from "../lib/api";

// Fetch best seller products from API
export const getBestSellers = async (): Promise<Product[]> => {
  try {
    const products = await getBestSellerProducts();
    return products || [];
  } catch (error) {
    console.error('Error fetching best seller products:', error);
    // Return empty array as fallback
    return [];
  }
};