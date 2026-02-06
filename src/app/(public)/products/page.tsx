import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ProductWithInventory } from '@/types/inventory';
import { ProductCard } from '@/components/shared/product-card';
import JsonLd from '@/components/json-ld';
import { generateCollectionSchema } from '@/lib/schemas/collection-schema';
import { generateBreadcrumbSchema } from '@/lib/schemas/breadcrumb-schema';
import { Shield, Truck } from 'lucide-react';

export const revalidate = 1800;

export const metadata: Metadata = {
  title: 'Cold Plunge Tubs & Chillers in Lebanon',
  description:
    'Browse our ice bath tubs, water chillers, and complete cold plunge systems. 1-year warranty on all products. Free delivery across Lebanon.',
  openGraph: {
    title: 'Cold Plunge Tubs & Chillers in Lebanon | Warrior Leap',
    description:
      'Ice bath tubs, water chillers, and complete cold plunge systems. 1-year warranty. Free delivery across Lebanon.',
    type: 'website',
    url: 'https://warriorleap.com/products',
  },
  alternates: {
    canonical: 'https://warriorleap.com/products',
  },
};

async function getProducts(): Promise<ProductWithInventory[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('products_with_inventory')
    .select('*')
    .neq('status', 'inactive')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return (data || []).sort((a: ProductWithInventory, b: ProductWithInventory) => {
    const orderA = a.display_order ?? 999;
    const orderB = b.display_order ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    if (a.computed_status === 'active' && b.computed_status !== 'active') return -1;
    if (a.computed_status !== 'active' && b.computed_status === 'active') return 1;
    return 0;
  });
}

export default async function ProductsPage() {
  const products = await getProducts();

  const breadcrumbs = [
    { name: 'Home', url: 'https://warriorleap.com' },
    { name: 'Products', url: 'https://warriorleap.com/products' },
  ];

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Our Products</h1>
          </div>
        </div>
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No products available</h2>
            <p className="text-gray-500">New products coming soon!</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      <JsonLd data={generateCollectionSchema(products)} />
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Our Products
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Premium ice tubs and chillers for recovery and wellness
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-5 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Free Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>1-Year Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Product Count */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-500 text-sm">
                Showing <span className="font-semibold text-gray-900">{products.length}</span> products
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
