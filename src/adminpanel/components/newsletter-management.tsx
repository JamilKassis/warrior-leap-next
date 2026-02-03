'use client';

import React, { useState, useEffect } from 'react';
import { EnvelopeIcon, TrashIcon, ArrowDownTrayIcon, UsersIcon, ChartBarIcon, CalendarIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { NewsletterApi, NewsletterSubscriber, NewsletterStats } from '@/lib/newsletter-api';

export function NewsletterManagement() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [stats, setStats] = useState<NewsletterStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [subscribersData, statsData] = await Promise.all([
        NewsletterApi.getSubscribers(),
        NewsletterApi.getStats()
      ]);
      setSubscribers(subscribersData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch newsletter data');
      console.error('Error fetching newsletter data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this subscriber?')) {
      return;
    }

    try {
      await NewsletterApi.deleteSubscriber(id);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete subscriber');
    }
  };

  const handleExport = async () => {
    try {
      const csvData = await NewsletterApi.exportSubscribers();
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export subscribers');
    }
  };

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscriber.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterActive === 'all' ||
                         (filterActive === 'active' && subscriber.is_active) ||
                         (filterActive === 'inactive' && !subscriber.is_active);
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 sm:py-12">
        <div className="relative">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-4 border-brand-primary/20 border-t-brand-primary"></div>
          <EnvelopeIcon className="absolute inset-0 m-auto w-4 h-4 sm:w-6 sm:h-6 text-brand-primary animate-pulse" />
        </div>
        <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-400 font-medium">Loading newsletter data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-primary rounded-lg sm:rounded-xl flex items-center justify-center">
            <EnvelopeIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl lg:text-2xl font-bold text-white">Newsletter Management</h2>
            <p className="text-[10px] sm:text-xs lg:text-sm text-gray-400">Manage your email subscribers and view analytics</p>
          </div>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-1 sm:gap-2 bg-brand-primary text-white px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 rounded-lg hover:bg-brand-primary/90 transition-colors text-xs sm:text-sm font-medium"
        >
          <ArrowDownTrayIcon className="w-3 h-3 sm:w-4 sm:h-4" />
          Export CSV
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 sm:p-3 lg:p-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <XCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            <p className="text-red-400 font-medium text-xs sm:text-sm">Error</p>
          </div>
          <p className="text-red-300 mt-0.5 sm:mt-1 text-[10px] sm:text-xs lg:text-sm">{error}</p>
        </div>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
          <div className="bg-brand-dark/30 border border-white/10 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
              <div className="w-7 h-7 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <UsersIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-400">Total</p>
                <p className="text-sm sm:text-lg lg:text-2xl font-bold text-white">{stats.total_subscribers}</p>
              </div>
            </div>
          </div>

          <div className="bg-brand-dark/30 border border-white/10 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
              <div className="w-7 h-7 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-400" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-400">Active</p>
                <p className="text-sm sm:text-lg lg:text-2xl font-bold text-white">{stats.active_subscribers}</p>
              </div>
            </div>
          </div>

          <div className="bg-brand-dark/30 border border-white/10 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
              <div className="w-7 h-7 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-400">Today</p>
                <p className="text-sm sm:text-lg lg:text-2xl font-bold text-white">{stats.today_subscribers}</p>
              </div>
            </div>
          </div>

          <div className="bg-brand-dark/30 border border-white/10 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 backdrop-blur-sm col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
              <div className="w-7 h-7 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-400">Week</p>
                <p className="text-sm sm:text-lg lg:text-2xl font-bold text-white">{stats.this_week_subscribers}</p>
              </div>
            </div>
          </div>

          <div className="bg-brand-dark/30 border border-white/10 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 backdrop-blur-sm col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
              <div className="w-7 h-7 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-indigo-400" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-400">Month</p>
                <p className="text-sm sm:text-lg lg:text-2xl font-bold text-white">{stats.this_month_subscribers}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-brand-dark/30 border border-white/10 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by email or source..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-3 text-xs sm:text-sm bg-white/5 border border-white/10 rounded-lg sm:rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all duration-300 placeholder-gray-500 text-white"
            />
          </div>
          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={() => setFilterActive('all')}
              className={`px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 text-[10px] sm:text-xs lg:text-sm ${
                filterActive === 'all'
                  ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              All ({subscribers.length})
            </button>
            <button
              onClick={() => setFilterActive('active')}
              className={`px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 text-[10px] sm:text-xs lg:text-sm ${
                filterActive === 'active'
                  ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <span className="hidden sm:inline">Active</span>
              <span className="sm:hidden">On</span>
              <span className="ml-1">({subscribers.filter(s => s.is_active).length})</span>
            </button>
            <button
              onClick={() => setFilterActive('inactive')}
              className={`px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 text-[10px] sm:text-xs lg:text-sm ${
                filterActive === 'inactive'
                  ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <span className="hidden sm:inline">Inactive</span>
              <span className="sm:hidden">Off</span>
              <span className="ml-1">({subscribers.filter(s => !s.is_active).length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subscribers Table - Desktop */}
      <div className="hidden sm:block bg-brand-dark/30 border border-white/10 rounded-lg sm:rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-3 py-2 lg:px-6 lg:py-4 text-left text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-3 py-2 lg:px-6 lg:py-4 text-left text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 py-2 lg:px-6 lg:py-4 text-left text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-3 py-2 lg:px-6 lg:py-4 text-left text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Subscribed
                </th>
                <th className="px-3 py-2 lg:px-6 lg:py-4 text-left text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                  IP Address
                </th>
                <th className="px-3 py-2 lg:px-6 lg:py-4 text-left text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-3 py-2 lg:px-6 lg:py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm font-medium text-white">{subscriber.email}</div>
                  </td>
                  <td className="px-3 py-2 lg:px-6 lg:py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full ${
                        subscriber.is_active
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {subscriber.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-3 py-2 lg:px-6 lg:py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm text-gray-300 capitalize">{subscriber.source.replace('_', ' ')}</div>
                  </td>
                  <td className="px-3 py-2 lg:px-6 lg:py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm text-gray-400">{formatDate(subscriber.subscribed_at)}</div>
                  </td>
                  <td className="px-3 py-2 lg:px-6 lg:py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="text-xs sm:text-sm text-gray-500">{subscriber.ip_address || 'N/A'}</div>
                  </td>
                  <td className="px-3 py-2 lg:px-6 lg:py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(subscriber.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-1 rounded hover:bg-red-500/10"
                      title="Delete subscriber"
                    >
                      <TrashIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSubscribers.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <EnvelopeIcon className="w-8 h-8 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-2 sm:mb-4" />
            <h3 className="text-sm sm:text-lg font-medium text-white mb-1 sm:mb-2">No subscribers found</h3>
            <p className="text-gray-400 text-xs sm:text-sm">
              {searchTerm || filterActive !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No newsletter subscribers yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Subscribers List - Mobile Cards */}
      <div className="sm:hidden space-y-2">
        {filteredSubscribers.map((subscriber) => (
          <div
            key={subscriber.id}
            className={`bg-brand-dark/30 border rounded-lg p-2.5 backdrop-blur-sm ${
              subscriber.is_active ? 'border-green-500/20' : 'border-white/10'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <EnvelopeIcon className="w-3 h-3 text-gray-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-white truncate">{subscriber.email}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                  <span className="capitalize">{subscriber.source.replace('_', ' ')}</span>
                  <span>•</span>
                  <span>{formatDate(subscriber.subscribed_at)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span
                  className={`inline-flex px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${
                    subscriber.is_active
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {subscriber.is_active ? 'On' : 'Off'}
                </span>
                <button
                  onClick={() => handleDelete(subscriber.id)}
                  className="text-red-400 p-1 rounded hover:bg-red-500/10"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredSubscribers.length === 0 && (
          <div className="text-center py-6 bg-brand-dark/30 border border-white/10 rounded-lg">
            <EnvelopeIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <h3 className="text-sm font-medium text-white mb-1">No subscribers found</h3>
            <p className="text-gray-400 text-[10px]">
              {searchTerm || filterActive !== 'all'
                ? 'Try adjusting your search or filter.'
                : 'No newsletter subscribers yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}