"use client";

import React from "react";
import {
  Close,
  ShoppingCartOutlined,
  Add,
  Remove,
  Delete,
  ArrowForward,
  ArrowLeft,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/contexts/CartContext";
import { useAuth } from "@/app/contexts/AuthContext";
import R2Image from "../component/dashboard/dashboardallproductstab/R2Image";
import { DEFAULT_THUMBNAIL } from "@/app/data/dashboardproductdata";

const CartPage: React.FC = () => {
  const { cartItems, updateCartItem, removeFromCart, loading } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  // Calculate totals from real cart data
  const subtotal = cartItems.reduce((total, item) => {
    const price = parseFloat(item.product?.price || '0');
    const discountAmount = price * (item.product?.discount || 0) / 100;
    const finalPrice = price - discountAmount;
    return total + (finalPrice * item.quantity);
  }, 0);

  const shipping = 299;
  const discount = 500;
  const finalTotal = Math.max(0, subtotal + shipping - discount);

  const handleUpdateQuantity = async (cartItemId: string, change: number) => {
    const item = cartItems.find(item => item.id === cartItemId);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + change);
    try {
      await updateCartItem(cartItemId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      await removeFromCart(cartItemId);
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#61503c]/10 rounded-full">
                  <ShoppingCartOutlined className="w-6 h-6 text-[#61503c]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Shopping Cart
                  </h1>
                  <p className="text-sm text-gray-500">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Cart Items
                </h2>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#61503c] mb-4"></div>
                    <p className="text-gray-600">Loading cart...</p>
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="p-6 bg-gray-100 rounded-full mb-6">
                      <ShoppingCartOutlined className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-sm">
                      Discover amazing art pieces and add them to your cart to see them here
                    </p>
                    <button
                      onClick={() => router.push('/')}
                      className="px-6 py-3 bg-[#61503c] text-white rounded-lg hover:bg-[#61503c]/90 font-medium transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => {
                      const price = parseFloat(item.product?.price || '0');
                      const discountAmount = price * (item.product?.discount || 0) / 100;
                      const finalPrice = price - discountAmount;
                      const originalPrice = price;

                      return (
                        <div
                          key={item.id}
                          className="group bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
                        >
                          <div className="flex items-start space-x-4">
                            <div className="relative flex-shrink-0">
                              {item.product?.thumbnail ? (
                                <R2Image
                                  src={item.product.thumbnail}
                                  fallbackSrc={DEFAULT_THUMBNAIL}
                                  alt={item.product.p_Name}
                                  className="w-20 h-20 rounded-lg object-cover shadow-inner"
                                />
                              ) : (
                                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center shadow-inner">
                                  <span className="text-sm font-medium text-gray-600">
                                    ART
                                  </span>
                                </div>
                              )}
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 text-black text-xs rounded-full flex items-center justify-center font-bold">
                                {item.quantity}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-lg mb-1">
                                {item.product?.p_Name || 'Unknown Product'}
                              </h3>
                              <p className="text-sm text-gray-500 mb-2">
                                Category: Digital Art
                              </p>
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-bold text-[#61503c]">
                                  ₹{finalPrice.toFixed(2)}
                                </span>
                                {item.product?.discount && item.product.discount > 0 && (
                                  <span className="text-sm text-gray-400 line-through">
                                    ₹{originalPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col items-end space-y-2">
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Delete className="w-5 h-5" />
                              </button>

                              <div className="flex items-center bg-gray-100 rounded-lg">
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, -1)}
                                  className="px-3 py-2 hover:bg-gray-200 rounded-l-lg transition-colors"
                                >
                                  <Remove className="w-4 h-4 text-gray-600" />
                                </button>
                                <span className="w-12 text-center font-medium text-gray-800 text-sm py-2">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, 1)}
                                  className="px-3 py-2 hover:bg-gray-200 rounded-r-lg transition-colors"
                                >
                                  <Add className="w-4 h-4 text-gray-600" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border sticky top-4">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Summary
                </h2>
              </div>

              {cartItems.length > 0 && (
                <div className="p-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>₹{shipping}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">
                          Total
                        </span>
                        <span className="text-2xl font-bold text-[#61503c]">
                          ₹{finalTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <button
                      onClick={() => router.push("/checkout")}
                      className="w-full bg-gradient-to-r from-[#61503c] to-[#61503c]/90 text-white py-4 rounded-lg font-semibold text-lg hover:from-[#61503c]/90 hover:to-[#61503c] transition-all shadow-lg flex items-center justify-center"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowForward className="w-5 h-5 ml-2" />
                    </button>

                    <button
                      onClick={() => router.push('/')}
                      className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                      Secure checkout • Free returns • 24/7 support
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
