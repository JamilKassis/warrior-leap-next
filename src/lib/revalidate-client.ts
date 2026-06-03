'use client';

import { getSupabaseClient } from '@/lib/supabase/client';

/**
 * Asks the server to immediately refresh the cached public pages (the /products
 * and /blog listing + detail pages) after an admin change, so edits appear right
 * away instead of waiting for ISR (up to 30 min for products, 1 hour for blog).
 *
 * Sends the admin's Supabase session token so the API route can verify the
 * caller. Fails silently — a missed revalidation only means the page updates on
 * its next scheduled revalidation, it never blocks or breaks the save itself.
 */
export async function revalidateStorefront(): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await fetch('/api/revalidate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
  } catch (err) {
    console.error('Failed to refresh storefront cache:', err);
  }
}
