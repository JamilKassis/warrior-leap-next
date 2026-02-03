'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';

export type Testimonial = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
  approved: boolean;
  ip_address: string;
  email?: string;
  phone?: string;
};

const getClientIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip || 'unknown';
  } catch {
    return typeof window !== 'undefined' && window.location.hostname === 'localhost' ? '127.0.0.1' : 'unknown';
  }
};

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchTestimonials = useCallback(async () => {
    if (!isInitialized) setLoading(true);
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (err) {
      console.error('Error in fetchTestimonials:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch testimonials'));
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (!isInitialized) fetchTestimonials();
  }, [fetchTestimonials, isInitialized]);

  const addTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'created_at' | 'approved' | 'ip_address'>) => {
    try {
      const supabase = getSupabaseClient();
      const ipAddress = await getClientIP();

      if (!testimonial.name || testimonial.name.trim().length < 2) throw new Error('Name must be at least 2 characters long');
      if (!testimonial.comment || testimonial.comment.trim().length < 10) throw new Error('Comment must be at least 10 characters long');
      if (!testimonial.rating || testimonial.rating < 1 || testimonial.rating > 5) throw new Error('Rating must be between 1 and 5');

      const { data, error } = await supabase
        .from('testimonials')
        .insert([{ ...testimonial, approved: false, ip_address: ipAddress }])
        .select()
        .single();

      if (error) {
        if (error.message?.includes('row-level security policy')) throw new Error('Unable to submit testimonial due to security restrictions.');
        throw error;
      }

      return { ...data, success: true, isRateLimited: false };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add testimonial');
      setError(error);
      throw error;
    }
  };

  return { testimonials, loading, error, addTestimonial, refreshTestimonials: fetchTestimonials };
}
