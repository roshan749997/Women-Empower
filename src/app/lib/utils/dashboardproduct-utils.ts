// lib/utils/dashboardproduct-utils.ts
import { Product } from "@/app/types/dashboardproduct";

export const calculateDiscountedPrice = (price: number, discount: number): number => {
  return Math.round(price - (price * discount) / 100);
};

export const getUniqueArtists = (products: Product[]): string[] => {
  const uniqueArtists = Array.from(new Set(products.map(p => p.artist_id)));
  return ["all", ...uniqueArtists];
};

export const filterProducts = (
  products: Product[],
  searchTerm: string,
  selectedCategory: string,
  selectedArtist: string
): Product[] => {
  return products.filter((product) => {
    const name = product.p_Name?.toLowerCase() || "";
    const description = product.description?.toLowerCase() || "";

    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      description.includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || product.category_id === selectedCategory;

    const matchesArtist =
      selectedArtist === "all" || product.artist_id === selectedArtist;

    return matchesSearch && matchesCategory && matchesArtist;
  });
};

export const formatCategoryName = (category: string): string => {
  if (category === "all") return "All Categories";
  if (category === "shubh_labh") return "Shubh Labh";
  if (category === "diya_thali") return "Diya & Thali";
  return category.charAt(0).toUpperCase() + category.slice(1);
};

export const getAllImages = (product: Product | null): string[] => {
  if (!product) return [];
  return [product.thumbnail, ...product.p_images].filter(img => img);
};