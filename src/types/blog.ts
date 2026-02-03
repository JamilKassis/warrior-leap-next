export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  featured_image: string;
  tags: string[];
  read_time: number;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  created_at?: string;
  updated_at?: string;
  view_count?: number;
  comment_count?: number;
}

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  featured_image: string;
  tags: string[];
  read_time: number;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
}

export type BlogStatus = 'draft' | 'published' | 'archived';

export interface ProductReview {
  id: string;
  blog_post_id: string;
  product_id: string;
  pros: string[];
  cons: string[];
  rating: number | null;
  verdict: string | null;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductReviewWithDetails extends ProductReview {
  product_name: string;
  product_price: number;
  product_image: string | null;
  product_description: string | null;
  blog_title: string;
  blog_slug: string;
  blog_author: string;
  blog_published_at: string;
}

export interface ProductReviewFormData {
  product_id: string;
  pros: string[];
  cons: string[];
  rating: number | null;
  verdict: string | null;
  display_order: number;
}
