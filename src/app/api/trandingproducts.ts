import { Product } from "../types/product";
import { getTrendingProducts as getTrendingProductsApi } from "../lib/api";

// Fetch trending products from API
export const getTrendingProducts = async (): Promise<Product[]> => {
  try {
    const products = await getTrendingProductsApi();
    return products || [];
  } catch (error) {
    console.error('Error fetching trending products:', error);
    // Return empty array as fallback
    return [];
  }
};