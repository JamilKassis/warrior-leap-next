'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';

export type TrustIndicator = {
  id: string;
  title: string;
  subtitle: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export function useTrustIndicators() {
  const [trustIndicators, setTrustIndicators] = useState<TrustIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTrustIndicators = useCallback(async () => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('trust_indicators')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTrustIndicators(data || []);
    } catch (err) {
      console.error('Error fetching trust indicators:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch trust indicators'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrustIndicators();
  }, [fetchTrustIndicators]);

  return { trustIndicators, loading, error, refreshTrustIndicators: fetchTrustIndicators };
}
