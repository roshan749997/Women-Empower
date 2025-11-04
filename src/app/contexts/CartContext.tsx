"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
// Cart API functions ok
import { addToCartApi, getCartItemsApi, updateCartItemApi, removeFromCartApi, CartItem } from "../lib/cartApi";
import { getToken, getUser } from "../lib/authApi";

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  error: string | null;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItem: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  getCartItemCount: () => number;
  isInCart: (productId: string) => boolean;
  getCartItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user, token } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch cart items when user changes
  useEffect(() => {
    const fetchCartItems = async () => {
      const currentUser = getUser();
      const currentToken = getToken();

      console.log('🛒 Fetching cart items - User:', currentUser?.email, 'Token:', currentToken ? 'exists' : 'null');

      if (!currentUser || !currentToken) {
        console.log('🛒 No user or token, clearing cart items');
        setCartItems([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const items = await getCartItemsApi(currentUser.id, currentToken);
        setCartItems(items);
        console.log('🛒 Cart items fetched successfully:', items.length, 'items');
      } catch (err) {
        console.error("Error fetching cart items:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch cart items";

        // Handle specific error cases
        if (errorMessage.includes("Forbidden") || errorMessage.includes("Access denied")) {
          console.log('🛒 Access denied, clearing cart items');
          setError(null);
        } else {
          setError(errorMessage);
        }

        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [user, token]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    const currentUser = getUser();
    const currentToken = getToken();

    // Debug logging
    console.log('🛒 Add to Cart Debug:');
    console.log('  - currentUser from getUser():', currentUser);
    console.log('  - currentToken from getToken():', currentToken ? currentToken.substring(0, 20) + '...' : 'null');

    if (!currentUser || !currentToken) {
      console.error('❌ Missing user or token:', { currentUser: !!currentUser, currentToken: !!currentToken });
      throw new Error("Please login to add items to cart");
    }

    try {
      setError(null);
      const cartData = {
        userId: currentUser.id,
        productId,
        quantity,
      };

      console.log('🛒 Sending cart data:', cartData);
      await addToCartApi(cartData, currentToken);
      console.log('✅ Item added to cart successfully');

      // Refresh cart items from API to get updated data
      await refreshCart();
    } catch (err) {
      console.error("Error adding to cart:", err);
      throw err;
    }
  };

  const updateCartItem = async (cartItemId: string, quantity: number) => {
    const currentToken = getToken();

    if (!currentToken) {
      throw new Error("Please login to update cart");
    }

    try {
      setError(null);
      await updateCartItemApi(cartItemId, quantity, currentToken);

      // Refresh cart items from API to get updated data
      await refreshCart();
    } catch (err) {
      console.error("Error updating cart item:", err);
      throw err;
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    const currentToken = getToken();

    if (!currentToken) {
      throw new Error("Please login to remove items from cart");
    }

    try {
      setError(null);
      await removeFromCartApi(cartItemId, currentToken);

      // Refresh cart items from API to get updated data
      await refreshCart();
    } catch (err) {
      console.error("Error removing from cart:", err);
      throw err;
    }
  };

  const refreshCart = async () => {
    const currentUser = getUser();
    const currentToken = getToken();

    if (!currentUser || !currentToken) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const items = await getCartItemsApi(currentUser.id, currentToken);
      setCartItems(items);
    } catch (err) {
      console.error("Error refreshing cart:", err);
      setError(err instanceof Error ? err.message : "Failed to refresh cart");
    } finally {
      setLoading(false);
    }
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (productId: string) => {
    return cartItems.some((item) => item.productId === productId);
  };

  const getCartItemQuantity = (productId: string) => {
    const item = cartItems.find((item) => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    cartItems,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    refreshCart,
    getCartItemCount,
    isInCart,
    getCartItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

