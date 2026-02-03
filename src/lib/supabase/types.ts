export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          author: string;
          featured_image: string | null;
          tags: string[];
          read_time: number;
          featured: boolean;
          status: 'draft' | 'published' | 'archived';
          views: number;
          likes: number;
          view_count: number;
          comment_count: number;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug?: string;
          excerpt: string;
          content: string;
          author?: string;
          featured_image?: string | null;
          tags?: string[];
          read_time?: number;
          featured?: boolean;
          status?: 'draft' | 'published' | 'archived';
          views?: number;
          likes?: number;
          published_at?: string | null;
        };
        Update: {
          title?: string;
          slug?: string;
          excerpt?: string;
          content?: string;
          author?: string;
          featured_image?: string | null;
          tags?: string[];
          read_time?: number;
          featured?: boolean;
          status?: 'draft' | 'published' | 'archived';
          views?: number;
          likes?: number;
          published_at?: string | null;
        };
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          subscribed_at: string;
          is_active: boolean;
          ip_address: string | null;
          user_agent: string | null;
          source: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          subscribed_at?: string;
          is_active?: boolean;
          ip_address?: string | null;
          user_agent?: string | null;
          source?: string;
        };
        Update: {
          email?: string;
          subscribed_at?: string;
          is_active?: boolean;
          ip_address?: string | null;
          user_agent?: string | null;
          source?: string;
        };
      };
    };
  };
};
