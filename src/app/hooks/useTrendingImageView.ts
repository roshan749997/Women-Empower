// hooks/useTrendingImageView.ts
'use client';
import { useState, useCallback } from "react";

export const useTrendingImageView = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const resetImageIndex = useCallback(() => {
    setCurrentImageIndex(0);
  }, []);

  const nextImage = useCallback((totalImages: number) => {
    if (totalImages > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    }
  }, []);

  const prevImage = useCallback((totalImages: number) => {
    if (totalImages > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }
  }, []);

  return {
    currentImageIndex,
    setCurrentImageIndex,
    resetImageIndex,
    nextImage,
    prevImage,
  };
};