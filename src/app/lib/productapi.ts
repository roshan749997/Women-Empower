import { Product, ProductFormData } from "@/app/types/dashboardproduct";
import { buildR2PublicUrl } from "@/app/lib/utils/dashboardartist-utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/v1";

// ✅ Utility: normalize raw API product into Product
const normalizeProduct = (raw: any): Product => {
  const resolvedId = raw.id || raw.product_id || raw._id || "";
  const resolvedCategoryId = raw.category_id || raw.categoryId || raw.category?.id || "";
  const resolvedArtistId = raw.artist_id || raw.artistId || raw.artist?.id || "";
  const resolveOne = (v: any) => buildR2PublicUrl(v ? String(v) : "");
  const resolveMany = (arr: any) => Array.isArray(arr) ? arr.map((v) => resolveOne(v)) : [];
  return {
    id: resolvedId,
    p_Name: raw.p_Name || "",
    thumbnail: resolveOne(raw.thumbnail || ""),
    p_images: resolveMany(raw.p_images),
    category_id: resolvedCategoryId,
    artist_id: resolvedArtistId,
    price: Number(raw.price) || 0,
    discount: Number(raw.discount) || 0,
    review_id: raw.review_id || "",
    sell_count: Number(raw.sell_count) || 0,
    description: raw.description || "",
    specification: raw.specification || "",
    isTrending: raw.isTrending ?? false,
  };
};

export const productService = {
  // 🔹 Get all products (paginated)
  getAllProductsPaginated: async (
    page: number = 1,
    limit: number = 12
  ): Promise<{ items: Product[]; totalItems: number; totalPages: number; currentPage: number; }> => {
    try {
      const url = `${API_BASE_URL}/product/?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`;
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      const parseJsonSafely = async (r: Response) => {
        const contentType = r.headers.get("content-type") || "";
        try {
          if (contentType.includes("application/json")) return await r.json();
          const text = await r.text();
          return { message: text } as any;
        } catch {
          return {} as any;
        }
      };
      const body: any = await parseJsonSafely(res);

      // If API returned the new paginated shape
      if (body?.data?.data && Array.isArray(body.data.data)) {
        const items = body.data.data.map(normalizeProduct);
        return {
          items,
          totalItems: Number(body.data.totalItems) || items.length,
          totalPages: Number(body.data.totalPages) || 1,
          currentPage: Number(body.data.currentPage) || page,
        };
      }

      // Fallback: handle non-paginated shapes
      const list = Array.isArray(body) ? body : (body?.data || body?.products || []);
      const items = Array.isArray(list) ? list.map(normalizeProduct) : [];
      return {
        items,
        totalItems: items.length,
        totalPages: 1,
        currentPage: 1,
      };
    } catch (error) {
      console.warn("Error fetching paginated products:", error);
      return { items: [], totalItems: 0, totalPages: 1, currentPage: 1 };
    }
  },
  // 🔹 Get trending products
  getTrendingProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/trending`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!response.ok) {
        console.error(`Failed to fetch trending products: ${response.status}`);
        return [];
      }

      const data = await response.json();
      const products = Array.isArray(data) ? data : data.data;
      if (!Array.isArray(products)) {
        console.warn("API returned invalid trending products data");
        return [];
      }
      return products.map(normalizeProduct).map(p => ({ ...p, isTrending: true }));
    } catch (error) {
      console.error("Error fetching trending products:", error);
      return [];
    }
  },
  // 🔹 Get all products
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const primary = await fetch(`${API_BASE_URL}/product/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      const parseJsonSafely = async (res: Response) => {
        const contentType = res.headers.get("content-type") || "";
        try {
          if (contentType.includes("application/json")) return await res.json();
          const text = await res.text();
          return { message: text };
        } catch {
          return {};
        }
      };

      let payload: any = null;
      if (primary.ok) {
        payload = await parseJsonSafely(primary);
      } else {
        console.warn(`Primary products endpoint failed (${primary.status}). Trying legacy /api/products...`);
        const legacy = await fetch(`http://localhost:5000/api/products`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });
        if (!legacy.ok) {
          console.warn(`Legacy products endpoint also failed (${legacy.status}).`);
          return [];
        }
        payload = await parseJsonSafely(legacy);
      }

      const products = Array.isArray(payload)
        ? payload
        : payload?.data || payload?.products || [];

      if (!Array.isArray(products)) {
        console.warn("Products payload not an array; returning empty list.");
        return [];
      }
      return products.map(normalizeProduct);
    } catch (error) {
      console.warn("Error fetching products:", error);
      return [];
    }
  },

  // 🔹 Get single product details
  getProductDetails: async (id: string): Promise<Product | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!response.ok) {
        console.error(`Failed to fetch product details: ${response.status}`);
        return null;
      }

      const data = await response.json();

      // ✅ API returns { success, message, data: {...} }
      if (data.success && data.data) {
        return normalizeProduct(data.data);
      }

      // Handle case where data is directly the product
      if (data.id || data.product_id || data._id) {
        return normalizeProduct(data);
      }

      return null;
    } catch (error) {
      console.error("Error fetching product details:", error);
      return null;
    }
  },

  // 🔹 Get related products by category ID
  getRelatedProducts: async (categoryId: string): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/related/${categoryId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!response.ok) {
        console.error(`Failed to fetch related products: ${response.status}`);
        return [];
      }

      const data = await response.json();

      // ✅ API returns { success, message, data: [...] }
      if (data.success && Array.isArray(data.data)) {
        return data.data.map(normalizeProduct);
      }

      // Handle case where data is directly an array
      if (Array.isArray(data)) {
        return data.map(normalizeProduct);
      }

      return [];
    } catch (error) {
      console.error("Error fetching related products:", error);
      return [];
    }
  },

  // 🔹 Create product
  createProduct: async (
    productData: Partial<Product>
  ): Promise<Product | null> => {
    try {
      // Upload data-URL images to R2 and keep only keys
      // In dev patching, escapes may duplicate; use proper runtime regex in _isDataUrl
      const _isDataUrl = (val?: string) => !!val && /^data:\w+\/[\w.+-]+;base64,/.test(val);
      const toKeyOrPass = async (val?: string): Promise<string> => {
        if (!val) return "";
        if (_isDataUrl(val)) {
          const { uploadToR2 } = await import('./utils/r2Client');
          const uploaded = await uploadToR2(val);
          return uploaded.key;
        }
        return val; // allow existing key or http(s) url
      };

      const thumbKey = await toKeyOrPass(productData.thumbnail || "");
      const imageKeys = Array.isArray(productData.p_images)
        ? await Promise.all(productData.p_images.map((img) => toKeyOrPass(img)))
        : [];

      // Clean the data before sending
      const cleanData = {
        p_Name: productData.p_Name,
        thumbnail: thumbKey,
        p_images: imageKeys,
        category_id: productData.category_id,
        artist_id: productData.artist_id,
        price: Number(productData.price),
        discount: Number(productData.discount) || 0,
        description: productData.description || "",
        specification: productData.specification || "",
        isTrending: productData.isTrending || false,
      };

      const { getAuthHeaders } = await import('./authApi');
      const response = await fetch(`${API_BASE_URL}/product/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(cleanData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          `Failed to create product: ${response.status}`,
          errorData
        );
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return normalizeProduct(data.data || data);
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  // 🔹 Update product
  updateProduct: async (
    id: string,
    productData: Partial<Product>
  ): Promise<Product | null> => {
    try {
      // Process any new data-URL images to R2 keys
      const _isDataUrl2 = (val?: string) => !!val && /^data:\w+\/[\w.+-]+;base64,/.test(val);
      const toKeyOrPass = async (val?: string): Promise<string> => {
        if (!val) return "";
        if (_isDataUrl2(val)) {
          const { uploadToR2 } = await import('./utils/r2Client');
          const uploaded = await uploadToR2(val);
          return uploaded.key;
        }
        return val;
      };

      // Clean the data before sending (include only provided fields)
      const cleanData: any = {};

      if (productData.p_Name !== undefined)
        cleanData.p_Name = productData.p_Name;
      if (productData.thumbnail !== undefined) {
        cleanData.thumbnail = await toKeyOrPass(productData.thumbnail);
      }
      if (productData.p_images !== undefined) {
        cleanData.p_images = Array.isArray(productData.p_images)
          ? await Promise.all(productData.p_images.map((img) => toKeyOrPass(img)))
          : [];
      }
      if (productData.category_id !== undefined)
        cleanData.category_id = productData.category_id;
      if (productData.artist_id !== undefined)
        cleanData.artist_id = productData.artist_id;
      if (productData.price !== undefined)
        cleanData.price = Number(productData.price);
      if (productData.discount !== undefined)
        cleanData.discount = Number(productData.discount);
      if (productData.description !== undefined)
        cleanData.description = productData.description;
      if (productData.specification !== undefined)
        cleanData.specification = productData.specification;
      if (productData.isTrending !== undefined)
        cleanData.isTrending = productData.isTrending;

      const { getAuthHeaders } = await import('./authApi');
      const response = await fetch(`${API_BASE_URL}/product/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(cleanData),
      });

      if (!response.ok) {
        let errorPayload: any = {};
        const contentType = response.headers.get("content-type") || "";
        try {
          if (contentType.includes("application/json")) {
            errorPayload = await response.json();
          } else {
            const text = await response.text();
            errorPayload = { message: text };
          }
        } catch {}
        console.error(`Failed to update product: ${response.status}`, errorPayload);
        throw new Error(errorPayload?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return normalizeProduct(data.data || data);
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  // 🔹 Delete product
  deleteProduct: async (id: string): Promise<boolean> => {
    try {
      const { getAuthHeaders } = await import('./authApi');
      const response = await fetch(`${API_BASE_URL}/product/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          `Failed to delete product: ${response.status}`,
          errorData
        );
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  // 🔹 Toggle trending status
  toggleTrending: async (
    id: string,
    isTrending: boolean
  ): Promise<Product | null> => {
    try {
      const { getAuthHeaders } = await import('./authApi');
      const response = await fetch(`${API_BASE_URL}/product/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ isTrending }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          `Failed to toggle trending: ${response.status}`,
          errorData
        );
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return normalizeProduct(data.data || data);
    } catch (error) {
      console.error("Error toggling trending:", error);
      throw error;
    }
  },

  // 🔹 Update product trending status
  updateProductTrendingStatus: async (
    id: string,
    isTrending: boolean
  ): Promise<Product> => {
    try {
      const url = `${API_BASE_URL}/product/${encodeURIComponent(id)}`;
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ isTrending }),
      });

      const parseJsonSafely = async (r: Response) => {
        const contentType = r.headers.get("content-type") || "";
        try {
          if (contentType.includes("application/json")) return await r.json();
          const text = await r.text();
          return { message: text } as any;
        } catch {
          return {} as any;
        }
      };

      const body: any = await parseJsonSafely(res);

      if (!res.ok) {
        const msg = body?.message || body?.error || `Failed to update trending status (status ${res.status})`;
        throw new Error(msg);
      }

      return normalizeProduct(body?.data || body);
    } catch (error) {
      console.error("Error updating product trending status:", error);
      throw error;
    }
  },
};
