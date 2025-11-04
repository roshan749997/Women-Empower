// app/trending/page.tsx
"use client";
import React, { useEffect } from "react";
import { TrendingProduct } from "../types/dashboardtrendingtab";
import { useTrendingManagement } from "../hooks/useTrendingManagement";
import { useTrendingImageView } from "../hooks/useTrendingImageView";
import { getAllImages } from "@/app/lib/utils/dashboardtrending-utils";
import { TrendingHeader } from "../component/dashboard/dashboardtrendingproductstab/TrendingHeader";
import { TrendingProductGrid } from "../component/dashboard/dashboardtrendingproductstab/TrendingProductGrid";
import { TrendingProductDrawer } from "../component/dashboard/dashboardtrendingproductstab/TrendingProductDrawer";
import { productService } from "@/app/lib/productapi";
import { getCategoriesApi } from "@/app/lib/api";

const INITIAL_PRODUCTS: TrendingProduct[] = [];

export default function TrendingPage() {
  const {
    products,
    setProductsList,
    showDrawer,
    drawerMode,
    selectedProduct,
    showDropdown,
    setShowDropdown,
    openDrawer,
    closeDrawer,
    removeFromTrending,
  } = useTrendingManagement(INITIAL_PRODUCTS);
  const [categoryNameMap, setCategoryNameMap] = React.useState<Record<string, string>>({});

  const {
    currentImageIndex,
    setCurrentImageIndex,
    resetImageIndex,
    nextImage,
    prevImage,
  } = useTrendingImageView();

  // Reset image index when drawer opens
  useEffect(() => {
    if (showDrawer) {
      resetImageIndex();
    }
  }, [showDrawer, resetImageIndex]);

  // Load trending products from API
  useEffect(() => {
    const load = async () => {
      const [items, categories] = await Promise.all([
        productService.getTrendingProducts(),
        getCategoriesApi().catch(() => []),
      ]);
      const cmap: Record<string, string> = {};
      const categoriesArr: any[] = Array.isArray(categories)
        ? (categories as any[])
        : ((categories as any)?.data ?? (categories as any)?.categories ?? []);
      (categoriesArr || []).forEach((c: any) => {
        if (c && c.id) cmap[c.id] = c.name || c.id;
      });
      setCategoryNameMap(cmap);
      // map to TrendingProduct shape expected by this tab
      const mapped: TrendingProduct[] = items.map((p) => ({
        id: p.id,
        p_Name: p.p_Name,
        p_thumbnail: p.thumbnail,
        p_images: p.p_images || [],
        category_id: p.category_id,
        artist_name: p.artist_id, // no name available in product model; using id
        price: p.price,
        discount: p.discount,
        review_id: p.review_id,
        sell_count: p.sell_count,
        description: p.description,
        specification: p.specification,
        isTrending: true,
      }));
      setProductsList(mapped);
    };
    load();
  }, [setProductsList]);

  const handleNextImage = () => {
    const allImages = getAllImages(selectedProduct);
    nextImage(allImages.length);
  };

  const handlePrevImage = () => {
    const allImages = getAllImages(selectedProduct);
    prevImage(allImages.length);
  };

  return (
    <div className="flex-1 p-6 bg-gray-100 overflow-y-auto min-h-screen">
      <div className="max-w-7xl mx-auto">
        <TrendingHeader totalCount={products.length} />

        <TrendingProductGrid
          products={products}
          showDropdown={showDropdown}
          onToggleDropdown={setShowDropdown}
          onOpenDrawer={openDrawer}
          onRemoveFromTrending={removeFromTrending}
          categoryNameMap={categoryNameMap}
        />
      </div>

      <TrendingProductDrawer
        showDrawer={showDrawer}
        selectedProduct={selectedProduct}
        currentImageIndex={currentImageIndex}
        onClose={closeDrawer}
        onNextImage={handleNextImage}
        onPrevImage={handlePrevImage}
        onSetImageIndex={setCurrentImageIndex}
      />
    </div>
  );
}
