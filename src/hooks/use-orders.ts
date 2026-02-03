'use client';

import { useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Order, CreateOrderData, UpdateOrderData, OrdersFilters } from '@/types/orders';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (orderData: CreateOrderData): Promise<Order | null> => {
    const supabase = getSupabaseClient();
    setLoading(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from('orders')
        .insert([{
          customer_name: orderData.customer_name,
          email: orderData.email,
          phone: orderData.phone,
          address: orderData.address,
          city: orderData.city,
          notes: orderData.notes,
          items: orderData.items,
          subtotal: orderData.subtotal,
          tax_amount: orderData.tax_amount || 0,
          shipping_amount: orderData.shipping_amount || 0,
          discount_amount: orderData.discount_amount || 0,
          total_amount: orderData.total_amount,
          payment_method: orderData.payment_method || 'cash_on_delivery',
          order_status: orderData.initial_order_status || 'pending',
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      if (!data) throw new Error('No data returned from database');
      return data as Order;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (filters?: OrdersFilters): Promise<Order[]> => {
    const supabase = getSupabaseClient();
    setLoading(true);
    setError(null);

    try {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });

      if (filters?.status) query = query.eq('order_status', filters.status);
      if (filters?.payment_status) query = query.eq('payment_status', filters.payment_status);
      if (filters?.priority) query = query.eq('priority', filters.priority);
      if (filters?.date_from) query = query.gte('created_at', filters.date_from);
      if (filters?.date_to) query = query.lte('created_at', filters.date_to);
      if (filters?.search) query = query.or(`customer_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,order_number.ilike.%${filters.search}%`);

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;

      const ordersData = data as Order[];
      setOrders(ordersData);
      return ordersData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderById = async (orderId: string): Promise<Order | null> => {
    const supabase = getSupabaseClient();
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase.from('orders').select('*').eq('id', orderId).single();
      if (fetchError) throw fetchError;
      return data as Order;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch order';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderByNumber = async (orderNumber: string): Promise<Order | null> => {
    const supabase = getSupabaseClient();
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase.from('orders').select('*').eq('order_number', orderNumber).single();
      if (fetchError) throw fetchError;
      return data as Order;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch order';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (orderId: string, updateData: UpdateOrderData): Promise<Order | null> => {
    const supabase = getSupabaseClient();
    setLoading(true);
    setError(null);

    try {
      const { data, error: updateError } = await supabase.from('orders').update(updateData).eq('id', orderId).select().single();
      if (updateError) throw updateError;

      setOrders(prev => prev.map(order => order.id === orderId ? { ...order, ...data } : order));
      return data as Order;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (orderId: string): Promise<boolean> => {
    const supabase = getSupabaseClient();
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase.from('orders').delete().eq('id', orderId);
      if (deleteError) throw deleteError;

      setOrders(prev => prev.filter(order => order.id !== orderId));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete order';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getOrderStats = async () => {
    const supabase = getSupabaseClient();
    try {
      const { count: totalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true });
      const { count: pendingOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('order_status', 'pending');
      const { count: processingOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('order_status', 'processing');
      const { count: confirmedOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('order_status', 'confirmed');
      const { count: shippedOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('order_status', 'shipped');
      const { data: revenueData } = await supabase.from('orders').select('total_amount').eq('payment_status', 'paid');
      const totalRevenue = revenueData?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const today = new Date().toISOString().split('T')[0];
      const { count: todayOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', today);
      const { count: urgentOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true }).in('priority', ['high', 'urgent']).not('order_status', 'in', '(delivered,cancelled)');

      return {
        totalOrders: totalOrders || 0,
        confirmedOrders: confirmedOrders || 0,
        pendingOrders: pendingOrders || 0,
        processingOrders: processingOrders || 0,
        shippedOrders: shippedOrders || 0,
        totalRevenue,
        todayOrders: todayOrders || 0,
        urgentOrders: urgentOrders || 0,
      };
    } catch (err) {
      console.error('Error fetching order stats:', err);
      throw err;
    }
  };

  return { orders, loading, error, createOrder, fetchOrders, fetchOrderById, fetchOrderByNumber, updateOrder, deleteOrder, getOrderStats };
};

export default useOrders;
