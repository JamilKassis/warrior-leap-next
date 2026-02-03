'use client';

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';

export interface Warranty {
  id: string;
  name: string;
  description: string;
  duration_months: number;
  coverage_details: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useWarranty() {
  const [warranty, setWarranty] = useState<Warranty | null>(null);
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveWarranty = async () => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('warranties')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      setWarranty(data);
    } catch (err) {
      console.error('Error fetching active warranty:', err);
      setError(err instanceof Error ? err.message : 'Failed to load warranty information');
      setWarranty({
        id: 'fallback',
        name: '6-Month Full Coverage',
        description: 'Our standard warranty coverage',
        duration_months: 6,
        coverage_details: "Comprehensive warranty covering all parts and labor. If anything goes wrong, we'll fix it at no cost.",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllWarranties = async () => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from('warranties').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setWarranties(data || []);
    } catch (err) {
      console.error('Error fetching warranties:', err);
      setError(err instanceof Error ? err.message : 'Failed to load warranties');
    }
  };

  useEffect(() => {
    fetchActiveWarranty();
  }, []);

  return { warranty, warranties, loading, error, refetch: fetchActiveWarranty, fetchAllWarranties };
}
