import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ProductWithInventory } from '@/types/inventory';
import JsonLd from '@/components/json-ld';
import { generateProductSchema } from '@/lib/schemas/product-schema';
import { generateBreadcrumbSchema } from '@/lib/schemas/breadcrumb-schema';
import ProductDetailClient from '@/components/product-detail/product-detail-client';

export const revalidate = 1800;

function nameToSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function getAllProducts(): Promise<ProductWithInventory[]> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from('products_with_inventory').select('*').neq('status', 'inactive');
  return (data || []) as ProductWithInventory[];
}

async function getProductBySlug(slug: string) {
  const products = await getAllProducts();
  return products.find((p) => nameToSlug(p.name) === slug) || null;
}

async function getProductImages(productId: string) {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('product_images')
    .select('image_url, image_alt, is_primary, sort_order')
    .eq('product_id', productId)
    .order('sort_order', { ascending: true });
  return data || [];
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({
    slug: nameToSlug(product.name),
  }));
}

function getProductCategory(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('system')) return 'Complete Ice Bath System';
  if (lower.includes('chiller')) return 'Ice Bath Water Chiller';
  if (lower.includes('tub')) return 'Portable Ice Bath Tub';
  return 'Cold Plunge Equipment';
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const category = getProductCategory(product.name);
  const seoTitle = `${product.name} - ${category}`;

  const metaDescription = product.seo_description
    || product.description?.substring(0, 155)
    || `Buy ${product.name} in Lebanon. Premium ${category.toLowerCase()} with free delivery and installation across Lebanon.`;

  return {
    title: seoTitle,
    description: metaDescription,
    openGraph: {
      title: `${seoTitle} | Warrior Leap`,
      description: metaDescription,
      type: 'website',
      url: `https://warriorleap.com/products/${slug}`,
      images: product.image_url ? [{ url: product.image_url }] : undefined,
    },
    alternates: {
      canonical: `https://warriorleap.com/products/${slug}`,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const productImages = await getProductImages(product.id);

  const breadcrumbs = [
    { name: 'Home', url: 'https://warriorleap.com' },
    { name: 'Products', url: 'https://warriorleap.com/products' },
    { name: product.name, url: `https://warriorleap.com/products/${slug}` },
  ];

  return (
    <>
      <JsonLd data={generateProductSchema(product)} />
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      <ProductDetailClient product={product} productImages={productImages} />
    </>
  );
}
