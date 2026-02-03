import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ProductWithInventory } from '@/types/inventory';
import { ProductCard } from '@/components/shared/product-card';
import JsonLd from '@/components/json-ld';
import { generateCollectionSchema } from '@/lib/schemas/collection-schema';
import { generateBreadcrumbSchema } from '@/lib/schemas/breadcrumb-schema';

export const revalidate = 1800;

export const metadata: Metadata = {
  title: 'Ice Tubs & Cold Plunge Products | Warrior Leap Lebanon',
  description:
    'Premium ice tubs, chillers, and cold plunge systems. Professional cold therapy equipment delivered across Lebanon.',
  openGraph: {
    title: 'Ice Tubs & Cold Plunge Products | Warrior Leap Lebanon',
    description:
      'Premium ice tubs, chillers, and cold plunge systems. Professional cold therapy equipment delivered across Lebanon.',
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
        <section className="py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-8">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-sm mx-auto">
                <p className="text-gray-700 font-medium">No products available</p>
                <p className="text-gray-600 text-sm mt-1">New products coming soon!</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      <JsonLd data={generateCollectionSchema(products)} />
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <section className="py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-brand-dark">Our Products</h1>
              <div className="inline-flex items-center px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full">
                <span className="text-sm font-medium">
                  {products.length} Product{products.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
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
