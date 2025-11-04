// hooks/useImageUpload.ts
'use client';
import { useState, useCallback } from "react";

export const useImageUpload = () => {
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string[]>(["", ""]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const handleThumbnailSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(prev => {
          const newPreview = [...prev];
          newPreview[index] = reader.result as string;
          return newPreview;
        });
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleThumbnailUrlChange = useCallback((url: string) => {
    setThumbnailPreview(url);
  }, []);

  const handleImageUrlChange = useCallback((url: string, index: number) => {
    setImagePreview(prev => {
      const newPreview = [...prev];
      newPreview[index] = url;
      return newPreview;
    });
  }, []);

  const removeThumbnail = useCallback(() => {
    setThumbnailPreview("");
  }, []);

  const removeImage = useCallback((index: number) => {
    setImagePreview(prev => {
      const newPreview = [...prev];
      newPreview[index] = "";
      return newPreview;
    });
  }, []);

  const resetImages = useCallback((thumbnail?: string, images?: string[]) => {
    setThumbnailPreview(thumbnail || "");
    setImagePreview(images || ["", ""]);
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
    thumbnailPreview,
    imagePreview,
    currentImageIndex,
    setCurrentImageIndex,
    handleThumbnailSelect,
    handleImageSelect,
    handleThumbnailUrlChange,
    handleImageUrlChange,
    removeThumbnail,
    removeImage,
    resetImages,
    nextImage,
    prevImage,
  };
};