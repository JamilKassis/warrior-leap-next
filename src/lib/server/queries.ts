import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ProductWithInventory } from '@/types/inventory';
import { Testimonial } from '@/hooks/use-testimonials';

/**
 * Server-side fetch of active products, sorted the same way across the site
 * (display_order, then in-stock first). Used by server components so product
 * names and prices are present in the initial HTML for crawlers and AI assistants.
 */
export async function getActiveProducts(): Promise<ProductWithInventory[]> {
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

/**
 * Server-side fetch of approved testimonials, newest first, so reviews render
 * in the initial HTML rather than after a client-side fetch.
 */
export async function getApprovedTestimonials(): Promise<Testimonial[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }

  return (data || []) as Testimonial[];
}
