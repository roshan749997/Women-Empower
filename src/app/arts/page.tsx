// app/arts/page.tsx
import { getAllProducts, getPriceRanges, getSortOptions, getCategoriesWithDetails } from "../api/products";
import ProductFilterClient from "../component/arts/ProductFilterClient";
import { Product } from "../types/product";

// Main page component (Server Component)
export default async function ArtsPage() {
  // Fetch data from API
  let products: Product[] = [];
  let categories: Array<{id: string; name: string; image: string}> = [];
  let error: string | null = null;

  try {
    products = await getAllProducts();
    // Fetch categories with details
    categories = await getCategoriesWithDetails(products);
  } catch (err) {
    console.error('Error fetching products or categories:', err);
    error = err instanceof Error ? err.message : 'Failed to fetch products';
  }

  // Process data on the server
  const priceRanges = getPriceRanges();
  const sortOptions = getSortOptions();

  return (
    <ProductFilterClient
      initialProducts={products}
      initialCategories={categories}
      initialPriceRanges={priceRanges}
      initialSortOptions={sortOptions}
      error={error}
    />
  );
}