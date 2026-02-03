'use client';

import { BlogPost } from '@/types/blog';
import { getSupabaseClient } from './supabase/client';

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

// Client-side blog API for admin + interactive features
export class BlogApi {
  static async incrementViews(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    try {
      const { data: post } = await supabase
        .from('blog_posts')
        .select('view_count')
        .eq('id', id)
        .single();

      if (post) {
        await supabase
          .from('blog_posts')
          .update({ view_count: ((post.view_count as number) || 0) + 1 })
          .eq('id', id);
      }
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  }

  static async getAllPosts(): Promise<BlogPost[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(convertRowToBlogPost);
  }

  static async createPost(post: Omit<BlogPost, 'id'>): Promise<BlogPost> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        featured_image: post.featured_image || null,
        tags: post.tags,
        read_time: post.read_time,
        featured: post.featured,
        status: post.status,
        published_at: post.status === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) throw error;
    return convertRowToBlogPost(data);
  }

  static async updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    const supabase = getSupabaseClient();
    const updateData: Record<string, unknown> = {};
    if (updates.title) updateData.title = updates.title;
    if (updates.slug) updateData.slug = updates.slug;
    if (updates.excerpt) updateData.excerpt = updates.excerpt;
    if (updates.content) updateData.content = updates.content;
    if (updates.author) updateData.author = updates.author;
    if (updates.featured_image !== undefined) updateData.featured_image = updates.featured_image || null;
    if (updates.tags) updateData.tags = updates.tags;
    if (updates.read_time) updateData.read_time = updates.read_time;
    if (updates.featured !== undefined) updateData.featured = updates.featured;
    if (updates.status) {
      updateData.status = updates.status;
      if (updates.status === 'published') updateData.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return convertRowToBlogPost(data);
  }

  static async deletePost(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) throw error;
  }

  static async searchPosts(searchTerm: string): Promise<BlogPost[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(convertRowToBlogPost);
  }
}
