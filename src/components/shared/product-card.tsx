'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Check, ShoppingCart, MessageCircle } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { ProductWithInventory } from '@/types/inventory';

interface ProductCardProps {
  product: ProductWithInventory;
  showAddToCart?: boolean;
  className?: string;
}

function isNewProduct(createdAt: string): boolean {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= 30;
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
      <div className={`group relative bg-white rounded-2xl overflow-hidden border border-gray-100 ${className}`}>
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
  const isNew = product.created_at && isNewProduct(product.created_at);
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discount = hasDiscount
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
    : 0;

  return (
    <div className={`group relative ${className}`}>
      <Link href={`/products/${urlFriendlyName}`} className="block">
        {/* Card Container */}
        <div className="relative h-full bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:-translate-y-1 flex flex-col">

          {/* Image Section */}
          <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-stone-100 overflow-hidden">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-contain p-3 md:p-6 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading="lazy"
            />

            {/* Top Badges - Only NEW and Discount */}
            <div className="absolute top-2 left-2 right-2 md:top-3 md:left-3 md:right-3 flex justify-between items-start z-10">
              {/* Left Badge: NEW only */}
              <div>
                {isNew && !isUnavailable && (
                  <span className="inline-block bg-emerald-500 text-white px-2 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold tracking-wider shadow-lg">
                    NEW
                  </span>
                )}
              </div>

              {/* Right Badge: Discount */}
              {hasDiscount && (
                <span className="inline-block bg-red-500 text-white px-2 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold shadow-lg">
                  -{discount}%
                </span>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-3 md:p-5 flex flex-col flex-1">
            {/* Product Name */}
            <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-snug line-clamp-2 mb-2 group-hover:text-brand-primary transition-colors">
              {product.name}
            </h3>

            {/* Price + Status */}
            <div className="flex items-baseline gap-1.5 md:gap-2 mb-3 md:mb-4">
              <span className="text-base md:text-xl font-bold text-gray-900">
                ${product.price.toFixed(0)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.original_price!.toFixed(0)}
                </span>
              )}
              {isOutOfStock && (
                <span className="text-xs text-amber-600 font-medium ml-auto">Out of Stock</span>
              )}
              {isInactive && (
                <span className="text-xs text-gray-500 font-medium ml-auto">Unavailable</span>
              )}
            </div>

            {/* Spacer to push button to bottom */}
            <div className="flex-1" />

            {/* Add to Cart Button - Always visible */}
            {isOutOfStock ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(`https://wa.me/96171457820?text=${encodeURIComponent(`Hi, I'd like to preorder: ${product.name}`)}`, '_blank', 'noopener,noreferrer');
                }}
                className="group/btn w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 rounded-xl py-2.5 md:py-3 font-semibold text-xs md:text-sm transition-all duration-200 hover:bg-gradient-to-r hover:from-brand-dark hover:to-brand-primary hover:text-white hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4 transition-transform duration-200 group-hover/btn:scale-110" />
                <span>Preorder</span>
              </button>
            ) : showAddToCart && !isInactive ? (
              <button
                onClick={handleAddToCart}
                className={`group/btn w-full flex items-center justify-center gap-2 py-2.5 md:py-3 rounded-xl font-semibold text-xs md:text-sm transition-all duration-200 ${
                  isAdded
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-brand-dark hover:to-brand-primary hover:text-white hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 transition-transform duration-200 group-hover/btn:scale-110" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            ) : isInactive ? (
              <div className="w-full bg-gray-100 text-gray-400 rounded-xl py-3 px-4 text-center text-sm font-medium">
                Unavailable
              </div>
            ) : null}
          </div>
        </div>
      </Link>
    </div>
  );
};
