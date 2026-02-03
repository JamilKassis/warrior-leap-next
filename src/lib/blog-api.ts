import { BlogPost } from '@/types/blog';
import { createServerSupabaseClient } from './supabase/server';

const convertRowToBlogPost = (row: Record<string, unknown>): BlogPost => ({
  id: row.id as string,
  slug: (row.slug as string) || '',
  title: row.title as string,
  excerpt: row.excerpt as string,
  content: row.content as string,
  author: row.author as string,
  featured_image: (row.featured_image as string) || '',
  tags: row.tags as string[],
  read_time: row.read_time as number,
  featured: row.featured as boolean,
  status: row.status as 'draft' | 'published' | 'archived',
  published_at: (row.published_at as string) || new Date().toISOString(),
  view_count: (row.view_count as number) || 0,
  comment_count: (row.comment_count as number) || 0,
});

// Server-side blog API for use in Server Components
export class BlogApiServer {
  static async getPublishedPosts(): Promise<BlogPost[]> {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, author, featured_image, tags, read_time, featured, status, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(convertRowToBlogPost);
  }

  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return convertRowToBlogPost(data);
  }

  static async getRelatedPosts(currentPostId: string, tags: string[], limit: number = 3): Promise<BlogPost[]> {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .neq('id', currentPostId)
      .overlaps('tags', tags)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).map(convertRowToBlogPost);
  }

  static async getAllSlugs(): Promise<string[]> {
    try {
      const supabase = createServerSupabaseClient();
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('blog_posts')
        .select('slug')
        .eq('status', 'published');

      if (error) return [];
      return (data || []).map((post) => post.slug);
    } catch {
      return [];
    }
  }
}
