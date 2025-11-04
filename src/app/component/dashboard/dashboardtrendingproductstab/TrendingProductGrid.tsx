// components/TrendingProductGrid.tsx
'use client';
import React from "react";
import { TrendingUp } from "lucide-react";
import { TrendingProduct, TrendingDrawerMode} from "@/app/types/dashboardtrendingtab";
import { TrendingProductCard } from "./TrendingProductCard";

interface TrendingProductGridProps {
  products: TrendingProduct[];
  showDropdown: string | null;
  onToggleDropdown: (id: string | null) => void;
  onOpenDrawer: (mode: TrendingDrawerMode, product: TrendingProduct) => void;
  onRemoveFromTrending: (id: string) => void;
  categoryNameMap?: Record<string, string>;
}

export const TrendingProductGrid: React.FC<TrendingProductGridProps> = ({
  products,
  showDropdown,
  onToggleDropdown,
  onOpenDrawer,
  onRemoveFromTrending,
  categoryNameMap,
}) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg">
        <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No trending products</h3>
        <p className="text-gray-600">Add products to trending from the main products page</p>
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
          <TrendingProductCard
            key={product.id}
            product={product}
            showDropdown={showDropdown}
            onToggleDropdown={onToggleDropdown}
            onOpenDrawer={onOpenDrawer}
            onRemoveFromTrending={onRemoveFromTrending}
            categoryNameMap={categoryNameMap}
          />
        ))}
      </div>
    </>
  );
};