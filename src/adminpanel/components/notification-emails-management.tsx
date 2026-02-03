'use client';

import React, { useState, useEffect } from 'react';
import { EnvelopeIcon, TrashIcon, PlusIcon, CheckCircleIcon, XCircleIcon, BellIcon } from '@heroicons/react/24/outline';
import { getSupabaseClient } from '@/lib/supabase/client';

interface NotificationEmail {
  id: string;
  email: string;
  name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function NotificationEmailsManagement() {
  const [emails, setEmails] = useState<NotificationEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    const supabase = getSupabaseClient();

    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('notification_emails')
        .select('*')
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      setEmails(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notification emails');
      console.error('Error fetching notification emails:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = getSupabaseClient();
    if (!newEmail.trim()) return;

    try {
      setSaving(true);
      setError(null);
      const { error: insertError } = await supabase
        .from('notification_emails')
        .insert([{ email: newEmail.trim(), name: newName.trim() || null }]);

      if (insertError) throw insertError;

      setNewEmail('');
      setNewName('');
      setShowAddForm(false);
      await fetchEmails();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add email');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const supabase = getSupabaseClient();

    try {
      setError(null);
      const { error: updateError } = await supabase
        .from('notification_emails')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (updateError) throw updateError;
      await fetchEmails();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update email status');
    }
  };

  const handleDelete = async (id: string, email: string) => {
    const supabase = getSupabaseClient();
    if (!window.confirm(`Are you sure you want to delete ${email}?`)) return;

    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from('notification_emails')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchEmails();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete email');
    }
  };

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
          <BellIcon className="absolute inset-0 m-auto w-4 h-4 sm:w-6 sm:h-6 text-brand-primary animate-pulse" />
        </div>
        <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-400 font-medium">Loading notification settings...</span>
      </div>
    );
  }

  const activeCount = emails.filter(e => e.is_active).length;
  const inactiveCount = emails.filter(e => !e.is_active).length;

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-primary rounded-lg sm:rounded-xl flex items-center justify-center">
            <BellIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl lg:text-2xl font-bold text-white">Order Notification Emails</h2>
            <p className="text-[10px] sm:text-xs lg:text-sm text-gray-400">Manage email addresses that receive order notifications</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center gap-1 sm:gap-2 bg-brand-primary text-white px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 rounded-lg hover:bg-brand-primary/90 transition-colors text-xs sm:text-sm font-medium"
        >
          <PlusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
          Add Email
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
      <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
        <div className="bg-brand-dark/30 border border-white/10 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
            <div className="w-7 h-7 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <EnvelopeIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-400">Total</p>
              <p className="text-sm sm:text-lg lg:text-2xl font-bold text-white">{emails.length}</p>
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
              <p className="text-sm sm:text-lg lg:text-2xl font-bold text-white">{activeCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-brand-dark/30 border border-white/10 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
            <div className="w-7 h-7 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <XCircleIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-400">Inactive</p>
              <p className="text-sm sm:text-lg lg:text-2xl font-bold text-white">{inactiveCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Email Form */}
      {showAddForm && (
        <div className="bg-brand-dark/30 border border-white/10 rounded-lg sm:rounded-xl p-2.5 sm:p-4 lg:p-6 backdrop-blur-sm">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-2 sm:mb-3 lg:mb-4">Add New Email</h3>
          <form onSubmit={handleAdd} className="space-y-2 sm:space-y-3 lg:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
              <div>
                <label className="block text-[10px] sm:text-xs lg:text-sm font-medium text-gray-300 mb-0.5 sm:mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  placeholder="email@example.com"
                  className="w-full px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-3 text-xs sm:text-sm bg-white/5 border border-white/10 rounded-lg sm:rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all duration-300 placeholder-gray-500 text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs lg:text-sm font-medium text-gray-300 mb-0.5 sm:mb-1">
                  Name (Optional)
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-3 text-xs sm:text-sm bg-white/5 border border-white/10 rounded-lg sm:rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all duration-300 placeholder-gray-500 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button
                type="submit"
                disabled={saving || !newEmail.trim()}
                className="inline-flex items-center gap-1 sm:gap-2 bg-brand-primary text-white px-3 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-2 rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-medium"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    Add Email
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewEmail('');
                  setNewName('');
                }}
                className="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-2 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 transition-colors text-xs sm:text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Emails List - Desktop Table */}
      <div className="hidden sm:block bg-brand-dark/30 border border-white/10 rounded-lg sm:rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-3 py-2 lg:px-6 lg:py-4 text-left text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-3 py-2 lg:px-6 lg:py-4 text-left text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-3 py-2 lg:px-6 lg:py-4 text-left text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 py-2 lg:px-6 lg:py-4 text-left text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Added
                </th>
                <th className="px-3 py-2 lg:px-6 lg:py-4 text-left text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {emails.map((emailItem) => (
                <tr key={emailItem.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-3 py-2 lg:px-6 lg:py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <EnvelopeIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                      <span className="text-xs sm:text-sm font-medium text-white">{emailItem.email}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 lg:px-6 lg:py-4 whitespace-nowrap">
                    <span className="text-xs sm:text-sm text-gray-400">{emailItem.name || '-'}</span>
                  </td>
                  <td className="px-3 py-2 lg:px-6 lg:py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(emailItem.id, emailItem.is_active)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full cursor-pointer transition-colors ${
                        emailItem.is_active
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                      }`}
                    >
                      {emailItem.is_active ? (
                        <>
                          <CheckCircleIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircleIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-3 py-2 lg:px-6 lg:py-4 whitespace-nowrap">
                    <span className="text-xs sm:text-sm text-gray-400">{formatDate(emailItem.created_at)}</span>
                  </td>
                  <td className="px-3 py-2 lg:px-6 lg:py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(emailItem.id, emailItem.email)}
                      className="text-red-400 hover:text-red-300 transition-colors p-1 rounded hover:bg-red-500/10"
                      title="Delete email"
                    >
                      <TrashIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {emails.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <EnvelopeIcon className="w-8 h-8 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-2 sm:mb-4" />
            <h3 className="text-sm sm:text-lg font-medium text-white mb-1 sm:mb-2">No notification emails</h3>
            <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">Add email addresses to receive order notifications.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-1 sm:gap-2 bg-brand-primary text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-brand-primary/90 transition-colors text-xs sm:text-sm font-medium"
            >
              <PlusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              Add First Email
            </button>
          </div>
        )}
      </div>

      {/* Emails List - Mobile Cards */}
      <div className="sm:hidden space-y-2">
        {emails.map((emailItem) => (
          <div
            key={emailItem.id}
            className={`bg-brand-dark/30 border rounded-lg p-2.5 backdrop-blur-sm ${
              emailItem.is_active ? 'border-green-500/20' : 'border-white/10'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <EnvelopeIcon className="w-3 h-3 text-gray-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-white truncate">{emailItem.email}</span>
                </div>
                {emailItem.name && (
                  <p className="text-[10px] text-gray-400 mb-1">{emailItem.name}</p>
                )}
                <p className="text-[10px] text-gray-500">Added {formatDate(emailItem.created_at)}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => handleToggleActive(emailItem.id, emailItem.is_active)}
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold rounded-full cursor-pointer transition-colors ${
                    emailItem.is_active
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {emailItem.is_active ? (
                    <>
                      <CheckCircleIcon className="w-2.5 h-2.5" />
                      On
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="w-2.5 h-2.5" />
                      Off
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(emailItem.id, emailItem.email)}
                  className="text-red-400 p-1 rounded hover:bg-red-500/10"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {emails.length === 0 && (
          <div className="text-center py-6 bg-brand-dark/30 border border-white/10 rounded-lg">
            <EnvelopeIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <h3 className="text-sm font-medium text-white mb-1">No notification emails</h3>
            <p className="text-gray-400 mb-3 text-[10px]">Add email addresses to receive order notifications.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-1 bg-brand-primary text-white px-3 py-1.5 rounded-lg hover:bg-brand-primary/90 transition-colors text-xs font-medium"
            >
              <PlusIcon className="w-3 h-3" />
              Add First Email
            </button>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4">
        <div className="flex gap-2 sm:gap-3">
          <BellIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-300 font-medium text-xs sm:text-sm">How it works</p>
            <p className="text-blue-400/80 text-[10px] sm:text-xs lg:text-sm mt-0.5 sm:mt-1">
              When a new order is placed, all <strong className="text-blue-300">active</strong> email addresses will receive a notification
              with the order details. Toggle an email to inactive if you want to temporarily stop receiving notifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}