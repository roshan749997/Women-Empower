"use client";

import { useEffect, useState } from "react";
import { getCategoryDetailsApi } from "../lib/api";

type CategoryDetails = {
  id: string;
  name: string;
  image?: string;
};

// Simple in-memory cache to avoid refetching the same category repeatedly
const categoryCache = new Map<string, CategoryDetails>();

export const useCategoryDetails = (categoryId?: string) => {
  const [details, setDetails] = useState<CategoryDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(!!categoryId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!categoryId) {
        setLoading(false);
        setDetails(null);
        return;
      }

      // Serve from cache if present
      if (categoryCache.has(categoryId)) {
        setDetails(categoryCache.get(categoryId) || null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await getCategoryDetailsApi(categoryId);
        const normalized: CategoryDetails = {
          id: data?.id ?? categoryId,
          name: data?.name ?? String(categoryId),
          image: data?.image,
        };
        categoryCache.set(categoryId, normalized);
        if (!cancelled) setDetails(normalized);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load category");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  return { details, loading, error };
};

