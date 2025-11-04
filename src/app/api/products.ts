import { Product } from "../types/product";
import { getProductsApi, searchProductsApi, filterProductsApi, getCategoryDetailsApi } from "../lib/api";

// Category interface
interface Category {
  id: string;
  name: string;
  image: string;
}

// Fetch all products from API
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const products = await getProductsApi(1); // Get first page
    return products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return empty array as fallback
    return [];
  }
};

// Search products by query
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    if (!query.trim()) {
      return await getAllProducts();
    }
    const products = await searchProductsApi(query);
    return products || [];
  } catch (error) {
    console.error('Error searching products:', error);
    // Return empty array as fallback
    return [];
  }
};

// Filter products by categories and price range
export const filterProducts = async (filters: {
  categories?: string[];
  price?: {
    minPrice: number;
    maxPrice: number;
  };
}): Promise<Product[]> => {
  try {
    const products = await filterProductsApi(filters);
    return products || [];
  } catch (error) {
    console.error('Error filtering products:', error);
    // Return empty array as fallback
    return [];
  }
};

// Get categories from products
export const getCategoriesFromProducts = (products: Product[]): string[] => {
  return [...new Set(products.map((p) => p.category_id))];
};

// Get categories with details
export const getCategoriesWithDetails = async (products: Product[]): Promise<Category[]> => {
  try {
    const categoryIds = [...new Set(products.map((p) => p.category_id))];
    const categories: Category[] = [];
    
    // Fetch category details for each unique category ID
    for (const categoryId of categoryIds) {
      try {
        const categoryDetails = await getCategoryDetailsApi(categoryId);
        if (categoryDetails) {
          categories.push({
            id: categoryDetails.id,
            name: categoryDetails.name,
            image: categoryDetails.image
          });
        }
      } catch (error) {
        console.warn(`Failed to fetch details for category ${categoryId}:`, error);
        // Add fallback category with ID as name
        categories.push({
          id: categoryId,
          name: categoryId, // Fallback to ID if details can't be fetched
          image: ''
        });
      }
    }
    
    return categories;
  } catch (error) {
    console.error('Error fetching categories with details:', error);
    // Return fallback categories with IDs as names
    const categoryIds = [...new Set(products.map((p) => p.category_id))];
    return categoryIds.map(id => ({
      id,
      name: id,
      image: ''
    }));
  }
};

// Get price ranges for filtering
export const getPriceRanges = () => [
  { label: "Under ₹500", min: 0, max: 499 },
  { label: "₹500 - ₹750", min: 500, max: 750 },
  { label: "₹750 - ₹1000", min: 751, max: 1000 },
  { label: "₹1000 - ₹1500", min: 1001, max: 1500 },
  { label: "Over ₹1500", min: 1501, max: Infinity },
];

// Get sort options
export const getSortOptions = () => [
  "Popular",
  "Price: Low to High",
  "Price: High to Low",
  "Name A-Z",
  "Name Z-A",
];
