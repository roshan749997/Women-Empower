import React from 'react'
import ProductDetailsPage from '@/app/component/product/ProductDetailsPage'
import RelatedProductsWithCategory from '@/app/component/product/RelatedProductsWithCategory'
import ProductReviews from '../component/product/ProductReviews'

interface PageProps {
  searchParams: {
    id?: string;
  };
}

function page({ searchParams }: PageProps) {
  const productId = searchParams.id;

  return (
    <div>
      <ProductDetailsPage productId={productId} />
      <RelatedProductsWithCategory productId={productId} />
      <ProductReviews productId={productId} />
    </div>
  )
}

export default page;
