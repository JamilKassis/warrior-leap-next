'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { ProductWithInventory } from '@/types/inventory';

interface ProductCardProps {
  product: ProductWithInventory;
  showAddToCart?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showAddToCart = true,
  className = '',
}) => {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  if (!product) {
    return (
      <div className={`group relative bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
        <div className="p-6">
          <p className="text-gray-500 text-center">Product unavailable</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.computed_status === 'out_of_stock' || product.computed_status === 'inactive' || isAdded) {
      return;
    }

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

  const urlFriendlyName = product.name.toLowerCase().replace(/\s+/g, '-');
  const isOutOfStock = product.computed_status === 'out_of_stock';
  const isInactive = product.computed_status === 'inactive';
  const isUnavailable = isOutOfStock || isInactive;

  const getStatusBadge = () => {
    if (isInactive) {
      return (
        <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
          Unavailable
        </span>
      );
    }

    if (isOutOfStock) {
      return (
        <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
          Out of Stock
        </span>
      );
    }

    if (product.original_price && product.original_price > product.price) {
      const discount = Math.round(((product.original_price - product.price) / product.original_price) * 100);
      return (
        <span className="absolute top-2 left-2 bg-red-500 text-white px-3 py-2 rounded-full text-sm font-bold shadow-md z-10">
          -{discount}%
        </span>
      );
    }

    return null;
  };

  return (
    <div
      className={`group relative bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden w-full h-full flex flex-col ${className}`}
    >
      <Link href={`/products/${urlFriendlyName}`} className="block flex flex-col h-full relative">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden flex-shrink-0 bg-gray-100">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-contain p-2"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
          />
          {getStatusBadge()}
        </div>

        {/* Content */}
        <div className="p-3 md:p-4 flex-1 flex flex-col">
          <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-brand-primary">${product.price.toFixed(0)}</span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-xs text-gray-400 line-through">${product.original_price.toFixed(0)}</span>
            )}
          </div>
          {product.computed_status === 'inactive' && (
            <span className="text-xs text-red-500 font-medium mt-1">Unavailable</span>
          )}
        </div>
      </Link>

      {/* Add to Cart Button or Preorder Info */}
      <div className="px-2 pb-1.5 md:px-4 md:pb-4">
        {isOutOfStock ? (
          <div className="w-full bg-brand-primary/10 border border-brand-primary/30 rounded-lg py-2 px-3 text-center">
            <p className="text-sm font-semibold text-brand-primary">Preorder Available</p>
            <p className="text-xs text-brand-dark/70">Contact us on WhatsApp</p>
          </div>
        ) : showAddToCart && !isInactive ? (
          <button
            onClick={handleAddToCart}
            disabled={isUnavailable}
            className={`w-full flex items-center justify-center min-h-0 h-9 md:h-auto md:py-2 rounded font-medium text-xs md:text-sm leading-none transition-all duration-200 ${
              isAdded
                ? 'bg-green-500 text-white'
                : 'bg-brand-primary text-white hover:bg-brand-primary/90'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 mr-1.5" />
                Added
              </>
            ) : (
              'Add to Cart'
            )}
          </button>
        ) : null}
      </div>
    </div>
  );
};
