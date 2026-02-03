'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';

interface StickyMobileCartProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    computed_status?: string;
  };
  showWhenMainHidden?: boolean;
}

export default function StickyMobileCart({ product, showWhenMainHidden = false }: StickyMobileCartProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const isOutOfStock = product.computed_status === 'out_of_stock';
  const isInactive = product.computed_status === 'inactive';
  const isUnavailable = isOutOfStock || isInactive;

  const handleAddToCart = () => {
    if (isUnavailable || isAdded) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      urlFriendlyName: product.name.toLowerCase().replace(/\s+/g, '-'),
      status: product.computed_status || 'active',
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (isUnavailable) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50 md:hidden transition-transform duration-300 ${
        showWhenMainHidden ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 gap-4">
        <div className="flex-shrink-0">
          <p className="text-xs text-gray-500">Price</p>
          <p className="text-xl font-bold text-gray-900">${product.price.toLocaleString()}</p>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isAdded}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-base transition-all duration-300 ${
            isAdded ? 'bg-green-500 text-white' : 'bg-brand-primary text-white active:scale-95'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-5 h-5" />
              Added!
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </>
          )}
        </button>
      </div>

      <div className="h-safe-area-inset-bottom bg-white" />
    </div>
  );
}
