import { getTopCategories } from "@/app/api/category";
import { TopCategoriesClient } from '../categories/TopCategoriesClient';

export const TopCategories = async () => {
  // Fetch data on the server
  let categories = [];
  let error = null;

  try {
    categories = await getTopCategories();
  } catch (err) {
    console.error('Error fetching categories:', err);
    error = err instanceof Error ? err.message : 'Failed to fetch categories';
  }

  return (
    <div className="bg-[#f1f2f4] py-2 sm:py-2 px-2 sm:px-4">
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 bg-white rounded-sm">
        {error ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Error loading categories
            </h3>
            <p className="text-gray-600 mb-4">
              {error}
            </p>
            <a
              href="/"
              className="inline-block bg-[#61503c] text-white px-6 py-2 rounded-md hover:bg-[#7a5b3e] transition-all duration-200 transform hover:scale-105"
            >
              Try Again
            </a>
          </div>
        ) : categories.length > 0 ? (
          <TopCategoriesClient categories={categories} />
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No categories found
            </h3>
            <p className="text-gray-600">
              Check back later for available categories!
            </p>
          </div>
        )}
      </section>
    </div>
  );
};