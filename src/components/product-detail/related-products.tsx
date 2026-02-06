'use client';

import { useProducts } from '@/hooks/use-products';
import { ProductCard } from '@/components/shared/product-card';

interface RelatedProductsProps {
  currentProductName: string;
}

export default function RelatedProducts({ currentProductName }: RelatedProductsProps) {
  const { products, loading } = useProducts();

  const otherProducts = products.filter((product) => product.name !== currentProductName);

  if (loading) {
    return (
      <div className="mt-12 border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-2xl aspect-square animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (otherProducts.length === 0) return null;

  return (
    <div className="mt-12 border-t border-gray-200 pt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
        {otherProducts.slice(0, 3).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
