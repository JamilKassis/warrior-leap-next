'use client';

import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';

interface CartButtonProps {
  className?: string;
}

export const CartButton: React.FC<CartButtonProps> = ({ className = '' }) => {
  const { getTotalItems, setIsCartOpen } = useCart();
  const itemCount = getTotalItems();
  const [isClicked, setIsClicked] = useState(false);
  const [prevItemCount, setPrevItemCount] = useState(0);
  const [showBadgeAnimation, setShowBadgeAnimation] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  React.useEffect(() => {
    if (itemCount > prevItemCount && prevItemCount > 0) {
      setShowBadgeAnimation(true);
      setAnnouncement(`Item added to cart. ${itemCount} ${itemCount === 1 ? 'item' : 'items'} in cart.`);
      setTimeout(() => {
        setShowBadgeAnimation(false);
      }, 1500);
    } else if (itemCount < prevItemCount) {
      setAnnouncement(`Item removed. ${itemCount} ${itemCount === 1 ? 'item' : 'items'} in cart.`);
    }
    setPrevItemCount(itemCount);
  }, [itemCount, prevItemCount]);

  const handleClick = () => {
    setIsClicked(true);
    setIsCartOpen(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 200);
  };

  return (
    <div className="relative p-2">
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
      <button
        onClick={handleClick}
        className={`relative p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20
          hover:bg-white/20 transition-all duration-200 group ${
          isClicked ? 'scale-95 bg-white/25' : ''
        } ${className}`}
        aria-label={`Cart with ${itemCount} items`}
      >
        <ShoppingCart
          className={`w-6 h-6 text-white transition-all duration-200 ${
            isClicked ? 'scale-110' : 'group-hover:scale-105'
          }`}
        />
      </button>

      {itemCount > 0 && (
        <span
          className={`absolute top-1 right-1 bg-brand-primary text-white text-xs font-bold
          rounded-full w-5 h-5 flex items-center justify-center shadow-lg border border-white
          min-w-[20px] z-10 transform-gpu transition-all duration-500 ease-out ${
            showBadgeAnimation ? 'scale-110 animate-pulse' : 'scale-100'
          }`}
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </div>
  );
};
