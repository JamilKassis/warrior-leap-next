'use client';

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { ProductWithInventory } from '@/types/inventory';

export interface ProductsFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'name' | 'price' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

export const useProducts = (initialFilters?: ProductsFilters) => {
  const [products, setProducts] = useState<ProductWithInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async (filters: ProductsFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const supabase = getSupabaseClient();

      let query = supabase
        .from('products_with_inventory')
        .select('*')
        .neq('status', 'inactive');

      if (filters.search) query = query.ilike('name', `%${filters.search}%`);
      if (filters.inStock) query = query.eq('computed_status', 'active');
      if (filters.minPrice !== undefined) query = query.gte('price', filters.minPrice);
      if (filters.maxPrice !== undefined) query = query.lte('price', filters.maxPrice);

      const sortColumn = filters.sortBy || 'created_at';
      const sortOrder = filters.sortOrder || 'desc';
      query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;

      const sortedData = (data || []).sort((a: ProductWithInventory, b: ProductWithInventory) => {
        const orderA = a.display_order ?? 999;
        const orderB = b.display_order ?? 999;
        if (orderA !== orderB) return orderA - orderB;
        if (a.computed_status === 'active' && b.computed_status !== 'active') return -1;
        if (a.computed_status !== 'active' && b.computed_status === 'active') return 1;
        return 0;
      });

      setProducts(sortedData);
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = () => loadProducts(initialFilters);

  useEffect(() => {
    loadProducts(initialFilters);
  }, []);

  return { products, loading, error, loadProducts, refreshProducts };
};
