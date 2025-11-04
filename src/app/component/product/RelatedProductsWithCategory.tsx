"use client";

import React, { useState, useEffect } from 'react';
import RelatedProducts from './RelatedProducts';
import { productService } from '@/app/lib/productapi';

interface RelatedProductsWithCategoryProps {
  productId?: string;
}

const RelatedProductsWithCategory: React.FC<RelatedProductsWithCategoryProps> = ({ productId }) => {
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchProductCategory = async () => {
      if (!productId) return;
      
      try {
        const product = await productService.getProductDetails(productId);
        if (product?.category_id) {
          setCategoryId(product.category_id);
        }
      } catch (error) {
        console.error('Error fetching product category:', error);
      }
    };

    fetchProductCategory();
  }, [productId]);

  return <RelatedProducts categoryId={categoryId} />;
};

export default RelatedProductsWithCategory;
