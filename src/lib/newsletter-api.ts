'use client';

import { getSupabaseClient } from './supabase/client';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
  ip_address?: string;
  user_agent?: string;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface NewsletterStats {
  total_subscribers: number;
  active_subscribers: number;
  today_subscribers: number;
  this_week_subscribers: number;
  this_month_subscribers: number;
}

export interface SubscriptionResult {
  success: boolean;
  message: string;
  data?: NewsletterSubscriber;
}

async function getUserIP(): Promise<string | null> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return null;
  }
}

export class NewsletterApi {
  static async subscribe(email: string, source: string = 'blog_page'): Promise<SubscriptionResult> {
    const supabase = getSupabaseClient();
    const emailRegex = /^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: 'Please enter a valid email address' };
    }

    try {
      const ipAddress = await getUserIP();
      const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';

      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert([{
          email: email.toLowerCase().trim(),
          ip_address: ipAddress,
          user_agent: userAgent,
          source,
        }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return { success: false, message: 'This email is already subscribed to our newsletter' };
        }
        return { success: false, message: 'Failed to subscribe. Please try again later.' };
      }

      return { success: true, message: 'Successfully subscribed to our newsletter!', data };
    } catch {
      return { success: false, message: 'An unexpected error occurred. Please try again.' };
    }
  }

  static async unsubscribe(email: string): Promise<SubscriptionResult> {
    const supabase = getSupabaseClient();
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .update({ is_active: false })
        .eq('email', email.toLowerCase().trim())
        .select()
        .single();

      if (error) return { success: false, message: 'Failed to unsubscribe. Please try again later.' };
      if (!data) return { success: false, message: 'Email address not found in our newsletter list' };
      return { success: true, message: 'Successfully unsubscribed from our newsletter', data };
    } catch {
      return { success: false, message: 'An unexpected error occurred. Please try again.' };
    }
  }

  static async getSubscribers(): Promise<NewsletterSubscriber[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getStats(): Promise<NewsletterStats> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.rpc('get_newsletter_stats');
    if (error) throw error;
    return data || { total_subscribers: 0, active_subscribers: 0, today_subscribers: 0, this_week_subscribers: 0, this_month_subscribers: 0 };
  }

  static async deleteSubscriber(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  static async exportSubscribers(): Promise<string> {
    const subscribers = await this.getSubscribers();
    const csvHeader = 'Email,Subscribed At,Source,Active,IP Address\n';
    const csvRows = subscribers.map(sub =>
      `"${sub.email}","${sub.subscribed_at}","${sub.source}","${sub.is_active}","${sub.ip_address || ''}"`
    ).join('\n');
    return csvHeader + csvRows;
  }
}
