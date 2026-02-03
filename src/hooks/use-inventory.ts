'use client';

import { useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';

export interface InventoryFilters {
  search?: string;
  status?: 'active' | 'inactive' | 'out_of_stock';
  lowStock?: boolean;
  sortBy?: 'name' | 'stock_quantity' | 'price' | 'needs_reorder';
  sortOrder?: 'asc' | 'desc';
}

export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url: string;
  stock_quantity: number;
  reorder_point: number;
  computed_status: 'active' | 'inactive' | 'out_of_stock';
  needs_reorder: boolean;
  available_quantity: number;
  reserved_quantity: number;
  last_stock_update?: string;
  created_at: string;
  updated_at: string;
}

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInventory = async (filters: InventoryFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const supabase = getSupabaseClient();

      let query = supabase.from('products_with_inventory').select('*');

      if (filters.search) query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      if (filters.status) query = query.eq('computed_status', filters.status);
      if (filters.lowStock) query = query.eq('needs_reorder', true);

      const sortColumn = filters.sortBy || 'name';
      const sortOrder = filters.sortOrder || 'asc';
      query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;

      setInventory(data || []);
    } catch (err) {
      console.error('Error loading inventory:', err);
      setError(err instanceof Error ? err.message : 'Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId: string, newQuantity: number) => {
    try {
      setError(null);
      const supabase = getSupabaseClient();
      const { error: updateError } = await supabase.rpc('update_product_stock', {
        p_product_id: productId,
        p_new_quantity: newQuantity,
      });

      if (updateError) throw updateError;

      setInventory(prev => prev.map(item =>
        item.id === productId
          ? {
              ...item,
              stock_quantity: newQuantity,
              available_quantity: newQuantity,
              computed_status: newQuantity > 0 ? ('active' as const) : ('out_of_stock' as const),
              needs_reorder: newQuantity <= item.reorder_point,
              last_stock_update: new Date().toISOString(),
            }
          : item
      ));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update stock';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const adjustStock = async (productId: string, adjustment: number) => {
    try {
      setError(null);
      const supabase = getSupabaseClient();
      const { error: adjustError } = await supabase.rpc('adjust_product_stock', {
        p_product_id: productId,
        p_adjustment: adjustment,
      });

      if (adjustError) throw adjustError;

      setInventory(prev => prev.map(item => {
        if (item.id === productId) {
          const newQuantity = Math.max(0, item.stock_quantity + adjustment);
          return {
            ...item,
            stock_quantity: newQuantity,
            available_quantity: newQuantity,
            computed_status: newQuantity > 0 ? ('active' as const) : ('out_of_stock' as const),
            needs_reorder: newQuantity <= item.reorder_point,
            last_stock_update: new Date().toISOString(),
          };
        }
        return item;
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to adjust stock';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getLowStockItems = () => inventory.filter(item => item.needs_reorder);
  const refreshInventory = () => loadInventory();

  return { inventory, loading, error, loadInventory, updateStock, adjustStock, getLowStockItems, refreshInventory };
};
