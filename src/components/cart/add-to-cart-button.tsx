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

    addItem(cartItem);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const isOutOfStock = product.computed_status === 'out_of_stock';
  const isInactive = product.computed_status === 'inactive';
  const isDisabled = disabled || isOutOfStock || isInactive;

  const variantClasses = {
    primary: isAdded ? 'bg-green-500 text-white' : 'bg-brand-primary text-white hover:bg-brand-primary/90',
    secondary: isAdded ? 'bg-green-500 text-white' : 'bg-brand-light text-brand-dark hover:bg-brand-light/90',
    outline: isAdded
      ? 'bg-green-500 text-white border-2 border-green-500'
      : 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const buttonText = isOutOfStock
    ? 'Out of Stock'
    : isInactive
      ? 'Unavailable'
      : isAdded
        ? 'Added to Cart'
        : 'Add to Cart';

  return (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={`${variantClasses[variant]} ${sizeClasses[size]} font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg active:scale-95 ${isAdded ? 'transform scale-105 shadow-lg' : ''} ${className}`}
      aria-label={`Add ${product.name} to cart`}
    >
      {showIcon && (isAdded ? <Check className="w-5 h-5 animate-bounce" /> : <ShoppingCart className="w-5 h-5" />)}
      <span>{buttonText}</span>
    </button>
  );
};
