import { Category } from "../types/category";
import { getCategoriesApi } from "../lib/api";

// Fetch categories from API
export const getTopCategories = async (): Promise<Category[]> => {
  try {
    const categories = await getCategoriesApi();
    return categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return empty array as fallback
    return [];
  }
};