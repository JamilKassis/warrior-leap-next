'use client';

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { TrustIndicator } from '@/hooks/use-trust-indicators';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export function TrustIndicatorsManagement() {
  const [trustIndicators, setTrustIndicators] = useState<TrustIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<TrustIndicator | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchTrustIndicators();
  }, []);

  const fetchTrustIndicators = async () => {
    try {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from('trust_indicators')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTrustIndicators(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trust indicators');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const supabase = getSupabaseClient();

      if (editingIndicator) {
        // Update existing indicator
        const { error } = await supabase
          .from('trust_indicators')
          .update(formData)
          .eq('id', editingIndicator.id);

        if (error) throw error;
      } else {
        // Create new indicator
        const { error } = await supabase
          .from('trust_indicators')
          .insert([formData]);

        if (error) throw error;
      }

      resetForm();
      await fetchTrustIndicators();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save trust indicator');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this trust indicator?')) {
      return;
    }

    try {
      const supabase = getSupabaseClient();

      const { error } = await supabase
        .from('trust_indicators')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchTrustIndicators();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete trust indicator');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const supabase = getSupabaseClient();

      const { error } = await supabase
        .from('trust_indicators')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      await fetchTrustIndicators();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update trust indicator');
    }
  };

  const openModal = (indicator?: TrustIndicator) => {
    if (indicator) {
      setEditingIndicator(indicator);
      setFormData({
        title: indicator.title,
        subtitle: indicator.subtitle,
        display_order: indicator.display_order,
        is_active: indicator.is_active
      });
    } else {
      setEditingIndicator(null);
      setFormData({
        title: '',
        subtitle: '',
        display_order: Math.max(...trustIndicators.map(t => t.display_order), 0) + 1,
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingIndicator(null);
    setFormData({
      title: '',
      subtitle: '',
      display_order: 0,
      is_active: true
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-4 lg:space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white hidden">Trust Indicators</h2>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 bg-brand-primary text-white rounded-lg sm:rounded-xl hover:bg-brand-primary/90 transition-all duration-200 shadow-lg shadow-brand-primary/20"
        >
          <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1" />
          <span className="text-xs sm:text-sm font-medium">Add Indicator</span>
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-2 sm:p-3 lg:p-4">
          <div className="flex">
            <div className="ml-2 sm:ml-3">
              <h3 className="text-xs sm:text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 p-2 sm:p-3 lg:p-6">
          {trustIndicators.map((indicator) => (
            <div
              key={indicator.id}
              className={`relative border rounded-lg lg:rounded-xl p-2 sm:p-3 lg:p-4 transition-all duration-200 ${indicator.is_active
                  ? 'border-brand-primary/30 bg-brand-primary/10'
                  : 'border-white/5 bg-white/5 opacity-75'
                }`}
            >
              <div className="text-center mb-1.5 sm:mb-2 lg:mb-3">
                <div className="text-sm sm:text-base lg:text-xl font-bold text-white mb-0.5 lg:mb-1">{indicator.title}</div>
                <div className="text-[10px] sm:text-xs lg:text-sm text-gray-400 uppercase tracking-wide truncate">{indicator.subtitle}</div>
              </div>

              <div className="flex justify-center space-x-1 lg:space-x-2">
                <button
                  onClick={() => handleToggleActive(indicator.id, indicator.is_active)}
                  className={`p-0.5 sm:p-1 lg:p-1.5 rounded-lg transition-colors ${indicator.is_active
                      ? 'text-green-400 hover:bg-green-400/10'
                      : 'text-gray-500 hover:bg-white/10'
                    }`}
                  title={indicator.is_active ? 'Hide' : 'Show'}
                >
                  {indicator.is_active ? (
                    <EyeIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
                  ) : (
                    <EyeSlashIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
                  )}
                </button>

                <button
                  onClick={() => openModal(indicator)}
                  className="p-0.5 sm:p-1 lg:p-1.5 rounded-lg text-blue-400 hover:bg-blue-400/10 transition-colors"
                  title="Edit"
                >
                  <PencilIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
                </button>

                <button
                  onClick={() => handleDelete(indicator.id)}
                  className="p-0.5 sm:p-1 lg:p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
                  title="Delete"
                >
                  <TrashIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
                </button>
              </div>

              <div className="text-[8px] sm:text-[10px] lg:text-xs text-gray-500 text-center mt-1 lg:mt-2">
                Order: {indicator.display_order}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-3 lg:p-4 z-50 overflow-y-auto">
          <div className="bg-brand-dark/95 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-5 lg:p-8 max-w-md w-full shadow-2xl relative my-2 sm:my-4">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 text-center">
              {editingIndicator ? 'Edit Trust Indicator' : 'Add Trust Indicator'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                <div>
                  <label htmlFor="title" className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1 sm:mb-2">
                    Title (Main Text)
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-2 py-2 sm:px-3 sm:py-2.5 lg:px-4 lg:py-3 text-sm sm:text-base bg-white/5 border border-white/10 rounded-lg sm:rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all duration-300 placeholder-gray-500 text-white"
                    placeholder="e.g., 24/7, 100%, FAST"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subtitle" className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1 sm:mb-2">
                    Subtitle (Description)
                  </label>
                  <input
                    type="text"
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-2 py-2 sm:px-3 sm:py-2.5 lg:px-4 lg:py-3 text-sm sm:text-base bg-white/5 border border-white/10 rounded-lg sm:rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all duration-300 placeholder-gray-500 text-white"
                    placeholder="e.g., Customer Support, Quality Focus"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="display_order" className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1 sm:mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    id="display_order"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                    className="w-full px-2 py-2 sm:px-3 sm:py-2.5 lg:px-4 lg:py-3 text-sm sm:text-base bg-white/5 border border-white/10 rounded-lg sm:rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all duration-300 text-white"
                    min="1"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary bg-white/5 border-white/10 rounded focus:ring-brand-primary focus:ring-2"
                  />
                  <label htmlFor="is_active" className="ml-2 sm:ml-3 text-xs sm:text-sm font-medium text-gray-300">
                    Active (visible on website)
                  </label>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 lg:mt-8 flex justify-end space-x-2 sm:space-x-3 lg:space-x-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 text-xs sm:text-sm text-gray-300 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 sm:px-6 sm:py-2.5 lg:px-8 lg:py-3 text-xs sm:text-sm text-white bg-gradient-to-r from-brand-primary to-brand-dark border border-transparent rounded-lg sm:rounded-xl hover:from-brand-primary/90 hover:to-brand-dark/90 focus:outline-none focus:ring-4 focus:ring-brand-primary/50 transition-all duration-300 font-medium shadow-lg shadow-brand-primary/25 transform hover:scale-105"
                >
                  {editingIndicator ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}