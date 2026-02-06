'use client';

import React, { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { ProductWithInventory } from '@/types/inventory';

interface AddToCartButtonProps {
  product: ProductWithInventory;
  quantity?: number;
  disabled?: boolean;
  className?: string;
  showIcon?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity = 1,
  disabled = false,
  className = '',
  showIcon = true,
  variant = 'primary',
  size = 'md',
}) => {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (disabled || isAdded) return;

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price,
      image: product.image_url,
      description: product.description,
      urlFriendlyName: product.name.toLowerCase().replace(/\s+/g, '-'),
      status: product.computed_status || 'active',
      depositAmount: product.deposit_amount,
    };

    for (let i = 0; i < quantity; i++) {
      addItem(cartItem);
    }
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const isOutOfStock = product.computed_status === 'out_of_stock';
  const isInactive = product.computed_status === 'inactive';
  const isUnavailable = isOutOfStock || isInactive;
  const isDisabled = disabled || isUnavailable;

  const variantClasses = {
    primary: isAdded
      ? 'bg-emerald-500 text-white shadow-lg'
      : isUnavailable
        ? 'bg-gray-200 text-gray-500'
        : 'bg-gray-100 text-gray-700 hover:bg-brand-dark hover:text-white hover:shadow-lg',
    secondary: isAdded
      ? 'bg-emerald-500 text-white'
      : 'bg-brand-light text-brand-dark hover:bg-brand-light/80',
    outline: isAdded
      ? 'bg-emerald-500 text-white border-2 border-emerald-500'
      : 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm font-semibold',
    md: 'px-6 py-3 text-base font-semibold',
    lg: 'px-8 py-3.5 text-base font-bold',
  };

  const buttonText = isAdded
    ? 'Added to Cart'
    : isUnavailable
      ? 'Sold Out'
      : 'Add to Cart';

  return (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={`group ${variantClasses[variant]} ${sizeClasses[size]} rounded-xl transition-all duration-200 ease-out flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 ${isAdded ? 'scale-[1.02]' : ''} ${className}`}
      aria-label={`Add ${product.name} to cart`}
    >
      {showIcon && (isAdded ? <Check className="w-5 h-5 animate-bounce" /> : <ShoppingCart className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />)}
      <span>{buttonText}</span>
    </button>
  );
};
