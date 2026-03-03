'use client';

import { useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import {
  Transaction,
  CreateTransactionData,
  UpdateTransactionData,
  TransactionsFilters,
  TransactionStats,
  TransactionWithBalance,
} from '@/types/transactions';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async (filters?: TransactionsFilters): Promise<Transaction[]> => {
    const supabase = getSupabaseClient();
    setLoading(true);
    setError(null);

    try {
      let query = supabase.from('transactions').select('*').order('transaction_date', { ascending: false });

      if (filters?.category) query = query.eq('category', filters.category);
      if (filters?.type) query = query.eq('type', filters.type);
      if (filters?.date_from) query = query.gte('transaction_date', filters.date_from);
      if (filters?.date_to) query = query.lte('transaction_date', filters.date_to);
      if (filters?.search) query = query.ilike('description', `%${filters.search}%`);

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;

      const txns = data as Transaction[];
      setTransactions(txns);
      return txns;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transactions';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (txnData: CreateTransactionData): Promise<Transaction | null> => {
    const supabase = getSupabaseClient();
    setLoading(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from('transactions')
        .insert([{
          transaction_date: txnData.transaction_date,
          description: txnData.description,
          category: txnData.category,
          type: txnData.type,
          amount: txnData.amount,
          notes: txnData.notes || null,
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      if (!data) throw new Error('No data returned from database');
      return data as Transaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create transaction';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id: string, updateData: UpdateTransactionData): Promise<Transaction | null> => {
    const supabase = getSupabaseClient();
    setLoading(true);
    setError(null);

    try {
      const { data, error: updateError } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setTransactions(prev => prev.map(txn => txn.id === id ? { ...txn, ...data } : txn));
      return data as Transaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update transaction';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string): Promise<boolean> => {
    const supabase = getSupabaseClient();
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase.from('transactions').delete().eq('id', id);
      if (deleteError) throw deleteError;

      setTransactions(prev => prev.filter(txn => txn.id !== id));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete transaction';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTransactionStats = async (): Promise<TransactionStats> => {
    const supabase = getSupabaseClient();
    try {
      const { data } = await supabase.from('transactions').select('type, amount, transaction_date');
      const txns = (data || []) as Pick<Transaction, 'type' | 'amount' | 'transaction_date'>[];

      const now = new Date();
      const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

      let totalIncome = 0;
      let totalExpenses = 0;
      let monthIncome = 0;
      let monthExpenses = 0;

      for (const txn of txns) {
        if (txn.type === 'income') {
          totalIncome += txn.amount;
          if (txn.transaction_date >= monthStart) monthIncome += txn.amount;
        } else {
          totalExpenses += txn.amount;
          if (txn.transaction_date >= monthStart) monthExpenses += txn.amount;
        }
      }

      return {
        totalIncome,
        totalExpenses,
        netBalance: totalIncome - totalExpenses,
        transactionCount: txns.length,
        monthIncome,
        monthExpenses,
      };
    } catch (err) {
      console.error('Error fetching transaction stats:', err);
      throw err;
    }
  };

  const computeRunningBalances = (txns: Transaction[]): TransactionWithBalance[] => {
    const sorted = [...txns].sort(
      (a, b) => new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime()
        || new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    let balance = 0;
    return sorted.map(txn => {
      balance += txn.type === 'income' ? txn.amount : -txn.amount;
      return { ...txn, runningBalance: balance };
    });
  };

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionStats,
    computeRunningBalances,
  };
};

export default useTransactions;
