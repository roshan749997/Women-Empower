// components/ProductGrid.tsx
'use client';
import React from "react";
import { Package } from "lucide-react";
import { Product, DrawerMode } from "@/app/types/dashboardproduct";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  showDropdown: string | null;
  onToggleDropdown: (id: string | null) => void;
  onOpenDrawer: (mode: DrawerMode, product: Product) => void;
  onToggleTrending: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
  artistNameMap?: Record<string, string>;
  categoryNameMap?: Record<string, string>;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  showDropdown,
  onToggleDropdown,
  onOpenDrawer,
  onToggleTrending,
  onDelete,
  onViewDetails,
  artistNameMap,
  categoryNameMap,
}) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <>
      {showDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => onToggleDropdown(null)} />
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showDropdown={showDropdown}
            onToggleDropdown={onToggleDropdown}
            onOpenDrawer={onOpenDrawer}
            onToggleTrending={onToggleTrending}
            onDelete={onDelete}
            onViewDetails={onViewDetails}
            artistNameMap={artistNameMap}
          categoryNameMap={categoryNameMap}
          />
        ))}
      </div>
    </>
  );
};