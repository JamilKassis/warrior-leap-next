'use client';

import { useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import {
  Booking,
  CreateBookingData,
  UpdateBookingData,
  BookingsFilters,
  BookingStats,
} from '@/types/bookings';

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async (filters?: BookingsFilters): Promise<Booking[]> => {
    const supabase = getSupabaseClient();
    setLoading(true);
    setError(null);

    try {
      let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });

      if (filters?.status) query = query.eq('status', filters.status);
      if (filters?.package_type) query = query.eq('package_type', filters.package_type);
      if (filters?.zone) query = query.eq('location_zone', filters.zone);
      if (filters?.date_from) query = query.gte('event_date', filters.date_from);
      if (filters?.date_to) query = query.lte('event_date', filters.date_to);
      if (filters?.search) {
        query = query.or(
          `customer_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,booking_number.ilike.%${filters.search}%`
        );
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;

      const list = data as Booking[];
      setBookings(list);
      return list;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bookings';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (data: CreateBookingData): Promise<Booking | null> => {
    const supabase = getSupabaseClient();
    setLoading(true);
    setError(null);

    try {
      const { data: row, error: insertError } = await supabase
        .from('bookings')
        .insert([{
          customer_name: data.customer_name,
          email: data.email,
          phone: data.phone,
          event_date: data.event_date,
          event_time: data.event_time || null,
          duration_hours: data.duration_hours ?? null,
          guest_count: data.guest_count ?? null,
          package_type: data.package_type,
          service_level: data.service_level,
          location_zone: data.location_zone,
          location_address: data.location_address,
          addons: data.addons || [],
          notes: data.notes || null,
          status: 'pending',
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      if (!row) throw new Error('No data returned from database');
      return row as Booking;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit booking';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (id: string, updateData: UpdateBookingData): Promise<Booking | null> => {
    const supabase = getSupabaseClient();
    setLoading(true);
    setError(null);

    try {
      const { data, error: updateError } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setBookings(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
      return data as Booking;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update booking';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (id: string): Promise<boolean> => {
    const supabase = getSupabaseClient();
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase.from('bookings').delete().eq('id', id);
      if (deleteError) throw deleteError;

      setBookings(prev => prev.filter(b => b.id !== id));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete booking';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBookingStats = async (): Promise<BookingStats> => {
    const supabase = getSupabaseClient();
    try {
      const today = new Date().toISOString().split('T')[0];
      const monthStart = today.slice(0, 7) + '-01';

      const { count: totalBookings } = await supabase.from('bookings').select('*', { count: 'exact', head: true });
      const { count: pendingBookings } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending');
      const { count: confirmedBookings } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'confirmed');
      const { count: completedBookings } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'completed');
      const { count: upcomingBookings } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).gte('event_date', today).in('status', ['pending', 'confirmed']);
      const { count: monthBookings } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).gte('created_at', monthStart);
      const { data: revenueRows } = await supabase.from('bookings').select('estimated_total').eq('status', 'completed');
      const totalRevenue = (revenueRows || []).reduce((sum, b) => sum + (Number(b.estimated_total) || 0), 0);

      return {
        totalBookings: totalBookings || 0,
        pendingBookings: pendingBookings || 0,
        confirmedBookings: confirmedBookings || 0,
        completedBookings: completedBookings || 0,
        upcomingBookings: upcomingBookings || 0,
        monthBookings: monthBookings || 0,
        totalRevenue,
      };
    } catch (err) {
      console.error('Error fetching booking stats:', err);
      throw err;
    }
  };

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    updateBooking,
    deleteBooking,
    getBookingStats,
  };
};

export default useBookings;
