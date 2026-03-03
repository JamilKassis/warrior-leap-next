'use client';

import { useState, useEffect } from 'react';
import { useTransactions } from '@/hooks/use-transactions';
import {
  Transaction,
  TransactionCategory,
  TransactionType,
  TransactionsFilters,
  TransactionStats,
  TransactionWithBalance,
  CreateTransactionData,
  TRANSACTION_CATEGORIES,
} from '@/types/transactions';
import {
  BanknotesIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ScaleIcon,
  HashtagIcon,
} from '@heroicons/react/24/outline';

interface FormModal {
  isOpen: boolean;
  transaction: Transaction | null;
}

interface DeleteConfirmModal {
  isOpen: boolean;
  transaction: Transaction | null;
}

export function FinanceManagement() {
  const {
    transactions,
    loading,
    error,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionStats,
    computeRunningBalances,
  } = useTransactions();

  const [filters, setFilters] = useState<TransactionsFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [balancedTxns, setBalancedTxns] = useState<TransactionWithBalance[]>([]);
  const [formModal, setFormModal] = useState<FormModal>({ isOpen: false, transaction: null });
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<DeleteConfirmModal>({ isOpen: false, transaction: null });
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CreateTransactionData>({
    transaction_date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'other',
    type: 'expense',
    amount: 0,
    notes: '',
  });

  useEffect(() => {
    loadTransactions();
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      setBalancedTxns(computeRunningBalances(transactions));
    } else {
      setBalancedTxns([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions]);

  const loadTransactions = async () => {
    try {
      await fetchTransactions(filters);
    } catch (err) {
      console.error('Error loading transactions:', err);
    }
  };

  const loadStats = async () => {
    try {
      const s = await getTransactionStats();
      setStats(s);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleFilterChange = (key: keyof TransactionsFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined }));
  };

  const handleApplyFilters = () => loadTransactions();

  const handleClearFilters = () => {
    setFilters({});
    fetchTransactions();
  };

  const openCreateModal = () => {
    setFormData({
      transaction_date: new Date().toISOString().split('T')[0],
      description: '',
      category: 'other',
      type: 'expense',
      amount: 0,
      notes: '',
    });
    setFormModal({ isOpen: true, transaction: null });
  };

  const openEditModal = (txn: Transaction) => {
    setFormData({
      transaction_date: txn.transaction_date,
      description: txn.description,
      category: txn.category,
      type: txn.type,
      amount: txn.amount,
      notes: txn.notes || '',
    });
    setFormModal({ isOpen: true, transaction: txn });
  };

  const handleFormSubmit = async () => {
    if (!formData.description.trim() || formData.amount <= 0) {
      alert('Please fill in description and a positive amount.');
      return;
    }
    setSaving(true);
    try {
      if (formModal.transaction) {
        await updateTransaction(formModal.transaction.id, formData);
      } else {
        await createTransaction(formData);
      }
      setFormModal({ isOpen: false, transaction: null });
      loadTransactions();
      loadStats();
    } catch (err) {
      console.error('Error saving transaction:', err);
      alert('Failed to save transaction.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (txn: Transaction) => {
    setDeleteConfirmModal({ isOpen: true, transaction: txn });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmModal.transaction) return;
    setSaving(true);
    try {
      await deleteTransaction(deleteConfirmModal.transaction.id);
      setDeleteConfirmModal({ isOpen: false, transaction: null });
      loadStats();
    } catch (err) {
      console.error('Error deleting transaction:', err);
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryBadge = (category: TransactionCategory) => {
    const config = TRANSACTION_CATEGORIES[category];
    const colorMap: Record<string, string> = {
      green: 'bg-green-500/20 text-green-400',
      blue: 'bg-blue-500/20 text-blue-400',
      yellow: 'bg-yellow-500/20 text-yellow-400',
      purple: 'bg-purple-500/20 text-purple-400',
      orange: 'bg-orange-500/20 text-orange-400',
      red: 'bg-red-500/20 text-red-400',
      gray: 'bg-gray-500/20 text-gray-400',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorMap[config.color] || colorMap.gray}`}>
        {config.label}
      </span>
    );
  };

  // Sort balanced txns by date DESC for display (running balance computed ASC, display DESC)
  const displayTxns = [...balancedTxns].reverse();

  // ─── Form Modal ────────────────────────────────────────────────
  const FormModalComponent = () => {
    if (!formModal.isOpen) return null;
    const isEdit = !!formModal.transaction;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-brand-dark rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
            {isEdit ? 'Edit Transaction' : 'Add Transaction'}
          </h3>

          <div className="space-y-4">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
              <input
                type="date"
                value={formData.transaction_date}
                onChange={(e) => setFormData(prev => ({ ...prev, transaction_date: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g. Cold Therapy System Sale"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as TransactionCategory }))}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
              >
                {Object.entries(TRANSACTION_CATEGORIES).map(([key, { label }]) => (
                  <option key={key} value={key} className="bg-brand-dark">{label}</option>
                ))}
              </select>
            </div>

            {/* Type toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <div className="flex rounded-xl overflow-hidden border border-white/10">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                  className={`flex-1 py-2.5 text-sm font-medium transition-all ${
                    formData.type === 'income'
                      ? 'bg-green-500/20 text-green-400 border-r border-green-500/30'
                      : 'bg-white/5 text-gray-400 border-r border-white/10 hover:bg-white/10'
                  }`}
                >
                  + Income
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                  className={`flex-1 py-2.5 text-sm font-medium transition-all ${
                    formData.type === 'expense'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  - Expense
                </button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Amount (USD)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Notes (optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional details..."
                rows={2}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setFormModal({ isOpen: false, transaction: null })}
              disabled={saving}
              className="px-5 py-2.5 text-gray-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleFormSubmit}
              disabled={saving}
              className="px-6 py-2.5 text-white bg-brand-primary rounded-xl hover:bg-brand-primary/90 transition-all font-medium shadow-lg shadow-brand-primary/25 disabled:opacity-50 flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Saving...
                </>
              ) : (
                isEdit ? 'Update' : 'Add Transaction'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ─── Delete Modal ──────────────────────────────────────────────
  const DeleteModal = () => {
    if (!deleteConfirmModal.isOpen || !deleteConfirmModal.transaction) return null;
    const txn = deleteConfirmModal.transaction;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-red-200">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full">
            <TrashIcon className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Delete Transaction</h3>
          <div className="mb-6 text-center">
            <p className="text-gray-700 mb-3">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{txn.description}</span>?
            </p>
            <p className="text-sm text-red-600 font-medium">This action cannot be undone.</p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-left text-sm space-y-2 text-gray-800">
              <div><span className="font-medium text-gray-900">Date:</span> {formatDate(txn.transaction_date)}</div>
              <div><span className="font-medium text-gray-900">Amount:</span> {formatCurrency(txn.amount)}</div>
              <div><span className="font-medium text-gray-900">Type:</span> {txn.type}</div>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setDeleteConfirmModal({ isOpen: false, transaction: null })}
              disabled={saving}
              className="px-6 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 transition-all font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={saving}
              className="px-6 py-3 text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all font-medium shadow-lg disabled:opacity-50 flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ─── Loading / Error states ────────────────────────────────────
  if (loading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-brand-primary/60 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
        </div>
      </div>
    );
  }

  if (error && transactions.length === 0) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
        <div className="flex">
          <XCircleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-300">Error loading transactions</h3>
            <p className="mt-1 text-sm text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-4 lg:space-y-6">
      <FormModalComponent />
      <DeleteModal />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-brand-primary rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
            <BanknotesIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Finance</h2>
            <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">Track income, expenses, and business transactions</p>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 transition-all font-medium text-sm shadow-lg shadow-brand-primary/25"
        >
          <PlusIcon className="w-4 h-4" />
          Add Transaction
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          <div className="bg-brand-dark/30 rounded-lg lg:rounded-xl shadow-lg border border-white/10 backdrop-blur-md p-2 sm:p-3 lg:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowTrendingUpIcon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-green-400" />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-5 w-0 flex-1">
                <dt className="text-xs lg:text-sm font-medium text-gray-500 truncate">Total Income</dt>
                <dd className="text-sm sm:text-base lg:text-lg font-medium text-green-400">{formatCurrency(stats.totalIncome)}</dd>
              </div>
            </div>
          </div>
          <div className="bg-brand-dark/30 rounded-lg lg:rounded-xl shadow-lg border border-white/10 backdrop-blur-md p-2 sm:p-3 lg:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowTrendingDownIcon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-red-400" />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-5 w-0 flex-1">
                <dt className="text-xs lg:text-sm font-medium text-gray-500 truncate">Total Expenses</dt>
                <dd className="text-sm sm:text-base lg:text-lg font-medium text-red-400">{formatCurrency(stats.totalExpenses)}</dd>
              </div>
            </div>
          </div>
          <div className="bg-brand-dark/30 rounded-lg lg:rounded-xl shadow-lg border border-white/10 backdrop-blur-md p-2 sm:p-3 lg:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ScaleIcon className={`h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 ${stats.netBalance >= 0 ? 'text-green-400' : 'text-red-400'}`} />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-5 w-0 flex-1">
                <dt className="text-xs lg:text-sm font-medium text-gray-500 truncate">Net Balance</dt>
                <dd className={`text-sm sm:text-base lg:text-lg font-medium ${stats.netBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(stats.netBalance)}
                </dd>
              </div>
            </div>
          </div>
          <div className="bg-brand-dark/30 rounded-lg lg:rounded-xl shadow-lg border border-white/10 backdrop-blur-md p-2 sm:p-3 lg:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <HashtagIcon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-purple-400" />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-5 w-0 flex-1">
                <dt className="text-xs lg:text-sm font-medium text-gray-500 truncate">Transactions</dt>
                <dd className="text-sm sm:text-base lg:text-lg font-medium text-purple-400">{stats.transactionCount}</dd>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-brand-dark/30 rounded-lg lg:rounded-xl border border-white/10 p-2 sm:p-3 lg:p-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
              showFilters ? 'bg-brand-primary/20 border-brand-primary/30 text-brand-light' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <FunnelIcon className="w-4 h-4" />
            Filters
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-all"
          >
            Apply
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mt-3 pt-3 border-t border-white/10">
            <select
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-primary transition-all"
            >
              <option value="" className="bg-brand-dark">All Categories</option>
              {Object.entries(TRANSACTION_CATEGORIES).map(([key, { label }]) => (
                <option key={key} value={key} className="bg-brand-dark">{label}</option>
              ))}
            </select>
            <select
              value={filters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-primary transition-all"
            >
              <option value="" className="bg-brand-dark">All Types</option>
              <option value="income" className="bg-brand-dark">Income</option>
              <option value="expense" className="bg-brand-dark">Expense</option>
            </select>
            <input
              type="date"
              value={filters.date_from || ''}
              onChange={(e) => handleFilterChange('date_from', e.target.value)}
              placeholder="From"
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-primary transition-all"
            />
            <input
              type="date"
              value={filters.date_to || ''}
              onChange={(e) => handleFilterChange('date_to', e.target.value)}
              placeholder="To"
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-brand-primary transition-all"
            />
            <button
              onClick={handleClearFilters}
              className="col-span-2 lg:col-span-4 px-3 py-2 text-gray-400 hover:text-white text-sm transition-all"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-brand-dark/30 rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {displayTxns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    No transactions found. Add your first transaction to get started.
                  </td>
                </tr>
              ) : (
                displayTxns.map((txn) => (
                  <tr key={txn.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">{formatDate(txn.transaction_date)}</td>
                    <td className="px-4 py-3 text-sm text-white font-medium max-w-[200px] truncate">{txn.description}</td>
                    <td className="px-4 py-3">{getCategoryBadge(txn.category)}</td>
                    <td className={`px-4 py-3 text-sm font-semibold text-right whitespace-nowrap ${txn.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                      {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                    </td>
                    <td className={`px-4 py-3 text-sm font-medium text-right whitespace-nowrap ${txn.runningBalance >= 0 ? 'text-gray-300' : 'text-red-400'}`}>
                      {formatCurrency(txn.runningBalance)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-[150px] truncate">{txn.notes || '—'}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button onClick={() => openEditModal(txn)} className="p-1.5 text-gray-400 hover:text-brand-light transition-colors rounded-lg hover:bg-white/10">
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(txn)} className="p-1.5 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-white/10 ml-1">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-2">
        {displayTxns.length === 0 ? (
          <div className="bg-brand-dark/30 rounded-lg border border-white/10 p-6 text-center text-gray-500 text-sm">
            No transactions found.
          </div>
        ) : (
          displayTxns.map((txn) => (
            <div key={txn.id} className="bg-brand-dark/30 rounded-lg border border-white/10 p-3 sm:p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{txn.description}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{formatDate(txn.transaction_date)}</p>
                </div>
                <div className="text-right ml-3">
                  <p className={`text-sm font-semibold ${txn.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                  </p>
                  <p className={`text-xs mt-0.5 ${txn.runningBalance >= 0 ? 'text-gray-400' : 'text-red-400'}`}>
                    Bal: {formatCurrency(txn.runningBalance)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryBadge(txn.category)}
                  {txn.notes && (
                    <span className="text-xs text-gray-500 truncate max-w-[120px]">{txn.notes}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <button onClick={() => openEditModal(txn)} className="p-1.5 text-gray-400 hover:text-brand-light transition-colors">
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(txn)} className="p-1.5 text-gray-400 hover:text-red-400 transition-colors">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
