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
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl z-50 flex flex-col ${
          isAnimating
            ? 'animate-[slideInRight_0.3s_ease-out_forwards]'
            : 'animate-[slideOutRight_0.3s_ease-out_forwards]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">Cart ({items.length})</h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <ShoppingBag className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">Your cart is empty</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.id} className="p-4">
                  <div className="flex space-x-3">
                    <div className="w-16 h-16 relative rounded-lg bg-gray-50 border border-gray-200 p-1.5 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-900 text-sm truncate pr-2">{item.name}</h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-brand-primary font-medium text-sm mt-1">${formatPrice(item.price)}</p>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="w-3 h-3 text-gray-600" />
                        </button>
                        <span className="w-8 text-center text-sm text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="w-3 h-3 text-gray-600" />
                        </button>
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
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">Total</span>
              <span className="text-lg font-bold text-gray-900">${formatPrice(getTotalPrice())}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-brand-primary text-white py-2.5 rounded-lg font-medium hover:bg-brand-primary/90 transition-colors"
            >
              Checkout
            </button>

            <button
              onClick={handleClose}
              className="w-full text-gray-600 text-sm mt-2 py-2 hover:text-gray-900 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};
