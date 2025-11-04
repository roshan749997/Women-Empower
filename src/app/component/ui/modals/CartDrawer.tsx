"use client";

import React from "react";
import {
  Close,
  ShoppingCartOutlined,
  Add,
  Remove,
  Delete,
  ArrowForward,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/contexts/CartContext";
import { useAuth } from "@/app/contexts/AuthContext";
import R2Image from "../../dashboard/dashboardallproductstab/R2Image";
import { DEFAULT_THUMBNAIL } from "@/app/data/dashboardproductdata";

interface CartDrawerProps {
  isCartOpen: boolean;
  toggleCart: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  isCartOpen,
  toggleCart,
}) => {
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
    <>
      <div
        className={`fixed inset-0 backdrop-blur-sm bg-black/20 z-40 transition-all duration-300 ${isCartOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={toggleCart}
      />

      <div
        className={`fixed top-0 right-0 h-full w-[100%] sm:w-[28rem] bg-white shadow-2xl z-50 transform transition-all duration-500 ease-out ${isCartOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-[#61503c]/10 rounded-full">
                <ShoppingCartOutlined className="w-5 h-5 text-[#61503c]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Shopping Cart
                </h2>
                <p className="text-xs text-gray-500">
                  {cartItems.length} items
                </p>
              </div>
            </div>
            <button
              onClick={toggleCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Close className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#61503c] mb-4"></div>
                <p className="text-gray-600">Loading cart...</p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="p-5 bg-gray-100 rounded-full mb-4">
                  <ShoppingCartOutlined className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Discover amazing art pieces and add them
                </p>
                <button
                  onClick={toggleCart}
                  className="px-5 py-2.5 bg-[#61503c] text-white rounded-lg hover:bg-[#61503c]/90 text-sm"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => {
                  const price = parseFloat(item.product?.price || '0');
                  const discountAmount = price * (item.product?.discount || 0) / 100;
                  const finalPrice = price - discountAmount;
                  const originalPrice = price;

                  return (
                    <div
                      key={item.id}
                      className="group bg-white p-3 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative flex-shrink-0">
                          {item.product?.thumbnail ? (
                            <R2Image
                              src={item.product.thumbnail}
                              fallbackSrc={DEFAULT_THUMBNAIL}
                              alt={item.product.p_Name}
                              className="w-16 h-16 rounded-lg object-cover shadow-inner"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center shadow-inner">
                              <span className="text-xs font-medium text-gray-600">
                                ART
                              </span>
                            </div>
                          )}
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-black text-xs rounded-full flex items-center justify-center font-bold">
                            {item.quantity}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">
                            {item.product?.p_Name || 'Unknown Product'}
                          </h3>
                          <p className="text-xs text-gray-500 mb-1">
                            Category: Digital Art
                          </p>
                          <div className="flex items-center space-x-1">
                            <span className="text-base font-bold text-[#61503c]">
                              ₹{finalPrice.toFixed(2)}
                            </span>
                            {item.product?.discount && item.product.discount > 0 && (
                              <span className="text-xs text-gray-400 line-through">
                                ₹{originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-1">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                          >
                            <Delete className="w-4 h-4" />
                          </button>

                          <div className="flex items-center bg-gray-100 rounded-md">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, -1)}
                              className="px-2 py-1 hover:bg-gray-200 rounded-l-md"
                            >
                              <Remove className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="w-8 text-center font-medium text-gray-800 text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, 1)}
                              className="px-2 py-1 hover:bg-gray-200 rounded-r-md"
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

          {cartItems.length > 0 && (
            <div className="border-t border-gray-100 bg-white flex-shrink-0">
              <div className="p-4 space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>₹{shipping}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-gray-900">
                        Total
                      </span>
                      <span className="text-xl font-bold text-[#61503c]">
                        ₹{finalTotal}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      toggleCart();
                      router.push("/checkout"); // go to checkout page
                    }}
                    className="w-full bg-gradient-to-r from-[#61503c] to-[#61503c]/90 text-white py-3 rounded-lg font-semibold text-base hover:from-[#61503c]/90 hover:to-[#61503c] transition-all shadow">
                    <span>Proceed to Checkout</span>
                    <ArrowForward className="w-5 h-5 inline ml-1" />
                  </button>
                </div>

                <p className="text-center text-xs text-gray-500">
                  Secure checkout • Free returns • 24/7 support
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
