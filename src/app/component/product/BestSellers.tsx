import { getBestSellers } from "@/app/api/bestsellersproduct";
import { BestSellersClient } from "../bestsellers/BestSellersClient";
import { Product } from "@/app/types/product";

export const BestSellers = async () => {
  // Fetch data on the server
  let products: Product[] = [];
  let error = null;

  try {
    products = await getBestSellers();
  } catch (err) {
    console.error('Error fetching best sellers:', err);
    error = err instanceof Error ? err.message : 'Failed to fetch best sellers';
  }

  return (
    <div className="bg-[#f1f2f4] py-2 sm:py-2 px-2 sm:px-4">
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-5 bg-white rounded-sm">
        <div className="mb-4 sm:mb-5 text-left">
          <h2 className="text-black text-2xl sm:text-3xl font-bold">Best Sellers</h2>
        </div>

        {error ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Error loading best sellers
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
        ) : products.length > 0 ? (
          <BestSellersClient products={products} />
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No best sellers found
            </h3>
            <p className="text-gray-600">
              Check back later for our top products!
            </p>
          </div>
        )}
      </section>
    </div>
  );
};