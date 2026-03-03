export type TransactionCategory = 'sale' | 'supplier' | 'shipping' | 'marketing' | 'supplies' | 'refund' | 'other';
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  transaction_date: string;
  description: string;
  category: TransactionCategory;
  type: TransactionType;
  amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionData {
  transaction_date: string;
  description: string;
  category: TransactionCategory;
  type: TransactionType;
  amount: number;
  notes?: string;
}

export interface UpdateTransactionData {
  transaction_date?: string;
  description?: string;
  category?: TransactionCategory;
  type?: TransactionType;
  amount?: number;
  notes?: string;
}

export interface TransactionsFilters {
  category?: TransactionCategory;
  type?: TransactionType;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  transactionCount: number;
  monthIncome: number;
  monthExpenses: number;
}

export interface TransactionWithBalance extends Transaction {
  runningBalance: number;
}

export const TRANSACTION_CATEGORIES: Record<TransactionCategory, { label: string; color: string }> = {
  sale: { label: 'Sale', color: 'green' },
  supplier: { label: 'Supplier', color: 'blue' },
  shipping: { label: 'Shipping', color: 'yellow' },
  marketing: { label: 'Marketing', color: 'purple' },
  supplies: { label: 'Supplies', color: 'orange' },
  refund: { label: 'Refund', color: 'red' },
  other: { label: 'Other', color: 'gray' },
};
