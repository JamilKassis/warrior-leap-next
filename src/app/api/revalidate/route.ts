import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

// Refreshes the cached public pages immediately after an admin makes a change,
// so edits show up right away instead of waiting for ISR. These are the only
// server-rendered/cached pages that display admin-editable data:
//   - /products and /products/[slug] (cached 30 min): products, prices, stock,
//     warranty info
//   - /blog and /blog/[slug] (cached 1 hour): blog posts
// Everything else (home products, testimonials, trust badges) is client-fetched
// and already updates live, so it does not need revalidation.
//
// The caller is verified as an admin using the same Supabase session +
// profiles.role check that the admin panel (AdminGuard) already uses, so no
// extra secret or service-role key is required.
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  // Forward the caller's token so both the auth check and the profiles read run
  // as the signed-in user (satisfying row-level security), mirroring the client.
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  revalidatePath('/products');
  revalidatePath('/products/[slug]', 'page');
  revalidatePath('/blog');
  revalidatePath('/blog/[slug]', 'page');

  return NextResponse.json({ revalidated: true });
}
