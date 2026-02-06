'use client';

import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export const CartSidebar: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    getTotalPrice,
  } = useCart();

  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isCartOpen) {
      setShouldRender(true);
      setIsAnimating(true);
    } else if (shouldRender) {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isCartOpen, shouldRender]);

  const handleClose = () => {
    setIsCartOpen(false);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  if (!shouldRender) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col ${
          isAnimating
            ? 'animate-[slideInRight_0.3s_ease-out_forwards]'
            : 'animate-[slideOutRight_0.3s_ease-out_forwards]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-base font-bold text-gray-900">Your Cart</h2>
            <p className="text-xs text-gray-500 mt-0.5">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-gray-900 font-medium text-sm mb-1">Your cart is empty</p>
              <p className="text-gray-500 text-xs">Add products to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.id} className="px-5 py-4">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 relative rounded-xl bg-gray-50 border border-gray-200 p-1.5 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <h3 className="font-medium text-gray-900 text-sm leading-snug line-clamp-2">{item.name}</h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-gray-900">${formatPrice(item.price)}</span>
                        <div className="flex items-center bg-gray-100 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-l-lg hover:bg-gray-200 transition-colors"
                          >
                            <Minus className="w-3 h-3 text-gray-600" />
                          </button>
                          <span className="w-7 text-center text-xs font-semibold text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-r-lg hover:bg-gray-200 transition-colors"
                          >
                            <Plus className="w-3 h-3 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-5 bg-white">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="text-sm text-gray-900">${formatPrice(getTotalPrice())}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">Delivery</span>
              <span className="text-sm text-green-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-brand-dark">${formatPrice(getTotalPrice())}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-brand-dark text-white py-3 rounded-lg font-medium text-sm hover:bg-brand-dark/90 transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={handleClose}
              className="w-full text-gray-500 text-xs mt-3 py-1 hover:text-gray-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};
