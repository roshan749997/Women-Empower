// hooks/useProductManagement.ts
'use client';
import { useState, useCallback } from "react";
import { Product, ProductFormData, DrawerMode } from "@/app/types/dashboardproduct";
import { INITIAL_FORM_DATA, DEFAULT_THUMBNAIL } from "@/app/data/dashboardproductdata";
import { productService } from "@/app/lib/productapi";

export const useProductManagement = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("add");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(INITIAL_FORM_DATA);

  const openDrawer = useCallback((mode: DrawerMode, product?: Product) => {
    setDrawerMode(mode);
    setSelectedProduct(product || null);
    setShowDropdown(null);

    if (product) {
      // Map only the fields that ProductFormData expects
      const mappedData = {
        p_Name: product.p_Name || "",
        thumbnail: product.thumbnail || "",
        p_images: product.p_images || [],
        category_id: String(product.category_id || ""),
        artist_id: String(product.artist_id || ""),
        price: product.price || 0,
        discount: product.discount || 0,
        description: product.description || "",
        specification: product.specification || "",
      };
      console.log("Setting form data for edit:", mappedData);
      console.log("Product data:", product);
      setFormData(mappedData);
    } else {
      setFormData(INITIAL_FORM_DATA);
    }
    setShowDrawer(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setShowDrawer(false);
    setTimeout(() => {
      setSelectedProduct(null);
      setFormData(INITIAL_FORM_DATA);
    }, 300);
  }, []);

  const handleSave = useCallback(async (thumbnailPreview: string, imagePreview: string[]) => {
    const finalThumbnail = thumbnailPreview.trim() !== "" ? thumbnailPreview : DEFAULT_THUMBNAIL;
    const validImages = imagePreview.filter(img => img.trim() !== "");

    try {
      if (drawerMode === "add") {
        const created = await productService.createProduct({
          ...formData,
          thumbnail: finalThumbnail,
          p_images: validImages,
        });
        if (created) setProducts(prev => [...prev, created]);
      } else if (drawerMode === "edit" && selectedProduct) {
        const updated = await productService.updateProduct(selectedProduct.id, {
          ...formData,
          thumbnail: finalThumbnail,
          p_images: validImages,
        });
        if (updated) setProducts(prev => prev.map(p => p.id === selectedProduct.id ? updated : p));
      }
      closeDrawer();
    } catch (e) {
      console.error('Failed to save product', e);
      alert('Failed to save product. Please try again.');
    }
  }, [drawerMode, formData, selectedProduct, closeDrawer]);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.deleteProduct(id);
        setProducts(prev => prev.filter((p) => p.id !== id));
      } catch (e) {
        console.error('Failed to delete product', e);
        alert('Failed to delete product. Please try again.');
      }
      setShowDropdown(null);
    }
  }, []);

  const toggleTrending = useCallback(async (id: string) => {
    try {
      const target = products.find(p => p.id === id);
      if (!target) return;
      const next = !target.isTrending;
      const updated = await productService.toggleTrending(id, next);
      if (updated) setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
    } catch (e) {
      console.error('Failed to update trending', e);
      alert('Failed to update trending status.');
    }
    setShowDropdown(null);
  }, [products]);

  const handleInputChange = useCallback((field: keyof ProductFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  return {
    products,
    showDrawer,
    drawerMode,
    selectedProduct,
    showDropdown,
    setShowDropdown,
    formData,
    openDrawer,
    closeDrawer,
    handleSave,
    handleDelete,
    toggleTrending,
    handleInputChange,
  };
};