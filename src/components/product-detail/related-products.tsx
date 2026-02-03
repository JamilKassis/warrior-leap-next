'use client';

import Link from 'next/link';
import { useProducts } from '@/hooks/use-products';

interface RelatedProductsProps {
  currentProductName: string;
}

function nameToSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function RelatedProducts({ currentProductName }: RelatedProductsProps) {
  const { products, loading } = useProducts();

  const otherProducts = products.filter((product) => product.name !== currentProductName);

  if (loading) {
    return (
      <div className="mt-12 border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg aspect-square animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (otherProducts.length === 0) return null;

  return (
    <div className="mt-12 border-t border-gray-200 pt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {otherProducts.slice(0, 3).map((product) => (
          <Link
            key={product.id}
            href={`/products/${nameToSlug(product.name)}`}
            className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all hover:shadow-lg"
          >
            {product.computed_status !== 'active' && (
              <div className="absolute top-3 left-3 z-10">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                    product.computed_status === 'out_of_stock'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {product.computed_status === 'out_of_stock' ? 'Out of Stock' : 'Inactive'}
                </span>
              </div>
            )}

            <div className="aspect-square bg-gradient-to-br from-brand-light/30 to-brand-primary/10 p-4 flex items-center justify-center overflow-hidden rounded-lg border border-brand-primary/20">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-contain object-center group-hover:scale-105 transition-transform duration-300 ease-in-out"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-light/40 to-brand-primary/20 text-brand-primary rounded-lg">
                  <span className="text-4xl">📦</span>
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>

              <div className="mt-auto">
                <div className="text-lg font-bold">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-primary">${product.price.toFixed(2)}</span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.original_price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-2 text-sm font-medium text-brand-primary">View details →</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
