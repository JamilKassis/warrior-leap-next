'use client';

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { PlusIcon, XMarkIcon, PencilIcon, TrashIcon, ShieldCheckIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface Warranty {
  id: string;
  name: string;
  description: string;
  duration_months: number;
  coverage_details: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function WarrantyManagement() {
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingWarranty, setEditingWarranty] = useState<Warranty | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchWarranties();
  }, []);

  const fetchWarranties = async () => {
    try {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from('warranties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWarranties(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch warranties');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const warrantyData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      duration_months: Number(formData.get('duration_months')),
      coverage_details: formData.get('coverage_details') as string,
      is_active: formData.get('is_active') === 'on',
    };

    try {
      const supabase = getSupabaseClient();

      if (editingWarranty) {
        const { error } = await supabase
          .from('warranties')
          .update(warrantyData)
          .eq('id', editingWarranty.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('warranties')
          .insert([warrantyData]);

        if (error) throw error;
      }

      setEditingWarranty(null);
      setShowForm(false);
      (e.target as HTMLFormElement).reset();
      fetchWarranties();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save warranty');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this warranty? This action cannot be undone.')) {
      return;
    }

    try {
      const supabase = getSupabaseClient();

      const { error } = await supabase
        .from('warranties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchWarranties();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete warranty');
    }
  };

  const handleToggleActive = async (warranty: Warranty) => {
    try {
      const supabase = getSupabaseClient();

      const { error } = await supabase
        .from('warranties')
        .update({ is_active: !warranty.is_active })
        .eq('id', warranty.id);

      if (error) throw error;
      fetchWarranties();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update warranty status');
    }
  };

  const handleEdit = (warranty: Warranty) => {
    setEditingWarranty(warranty);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingWarranty(null);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingWarranty(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 sm:h-64">
        <div className="relative">
          <div className="w-10 h-10 sm:w-16 sm:h-16 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-primary rounded-lg sm:rounded-xl flex items-center justify-center">
            <ShieldCheckIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl lg:text-2xl font-bold text-white">Warranty Management</h2>
            <p className="text-[10px] sm:text-xs lg:text-sm text-gray-400">Manage warranty types and coverage options</p>
          </div>
        </div>
        {!showForm && (
          <button
            onClick={handleAddNew}
            className="inline-flex items-center gap-1 sm:gap-2 bg-brand-primary text-white px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 rounded-lg hover:bg-brand-primary/90 transition-colors text-xs sm:text-sm font-medium"
          >
            <PlusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            Create Warranty
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 sm:p-3 lg:p-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            <p className="text-red-400 font-medium text-xs sm:text-sm">Error</p>
          </div>
          <p className="text-red-300 mt-0.5 sm:mt-1 text-[10px] sm:text-xs lg:text-sm">{error}</p>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-brand-dark/30 border border-white/10 rounded-lg sm:rounded-xl p-2.5 sm:p-4 lg:p-6 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Form Header */}
            <div className="text-center pb-2 sm:pb-4 border-b border-white/10">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-brand-primary to-brand-dark rounded-xl sm:rounded-2xl mb-2 sm:mb-3 shadow-lg shadow-brand-primary/25">
                <ShieldCheckIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h2 className="text-sm sm:text-xl lg:text-2xl font-bold text-white">
                {editingWarranty ? 'Edit Warranty' : 'Create New Warranty'}
              </h2>
              <p className="text-[10px] sm:text-xs lg:text-sm text-gray-400 mt-0.5 sm:mt-1">Provide comprehensive warranty coverage for your products</p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label htmlFor="name" className="block text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-300 mb-0.5 sm:mb-1 flex items-center">
                    <ShieldCheckIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-brand-primary" />
                    Warranty Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    defaultValue={editingWarranty?.name}
                    required
                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-3 text-xs sm:text-sm bg-white/5 border border-white/10 rounded-lg sm:rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all duration-300 placeholder-gray-500 text-white"
                    placeholder="e.g., Premium Protection Plan"
                  />
                </div>

                <div>
                  <label htmlFor="duration_months" className="block text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-300 mb-0.5 sm:mb-1 flex items-center">
                    <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-green-400" />
                    Duration (Months) *
                  </label>
                  <input
                    type="number"
                    name="duration_months"
                    id="duration_months"
                    defaultValue={editingWarranty?.duration_months}
                    required
                    min="1"
                    max="120"
                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-3 text-xs sm:text-sm bg-white/5 border border-white/10 rounded-lg sm:rounded-xl focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all duration-300 placeholder-gray-500 text-white"
                    placeholder="e.g., 12"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-300 mb-0.5 sm:mb-1 flex items-center">
                    <DocumentTextIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-brand-primary" />
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    defaultValue={editingWarranty?.description}
                    rows={2}
                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-3 text-xs sm:text-sm bg-white/5 border border-white/10 rounded-lg sm:rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all duration-300 resize-none placeholder-gray-500 text-white"
                    placeholder="Brief description of what this warranty covers..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    id="is_active"
                    defaultChecked={editingWarranty?.is_active ?? true}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary bg-white/5 border-white/10 rounded focus:ring-brand-primary focus:ring-2"
                  />
                  <label htmlFor="is_active" className="ml-2 sm:ml-3 text-[10px] sm:text-xs lg:text-sm font-medium text-gray-300">
                    Active warranty (available for products)
                  </label>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label htmlFor="coverage_details" className="block text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-300 mb-0.5 sm:mb-1 flex items-center">
                    <DocumentTextIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-brand-primary" />
                    Coverage Details *
                  </label>
                  <textarea
                    name="coverage_details"
                    id="coverage_details"
                    defaultValue={editingWarranty?.coverage_details}
                    required
                    rows={4}
                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-3 text-xs sm:text-sm bg-white/5 border border-white/10 rounded-lg sm:rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all duration-300 resize-none placeholder-gray-500 text-white"
                    placeholder="Detailed coverage information..."
                  />
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl hidden sm:block">
                  <h3 className="text-xs sm:text-sm font-semibold text-blue-300 mb-1 sm:mb-2 flex items-center">
                    Warranty Tips
                  </h3>
                  <ul className="space-y-1 text-[10px] sm:text-xs text-blue-400/80">
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-1.5">•</span>
                      Be specific about what is and isn't covered
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-1.5">•</span>
                      Include clear terms and conditions
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-1.5">•</span>
                      Specify the claim process for customers
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-2 sm:space-x-3 pt-2 sm:pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-3 text-gray-300 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl hover:bg-white/10 transition-all duration-300 font-medium text-xs sm:text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 sm:px-6 sm:py-2 lg:px-8 lg:py-3 text-white bg-gradient-to-r from-brand-primary to-brand-dark border border-transparent rounded-lg sm:rounded-xl hover:from-brand-primary/90 hover:to-brand-dark/90 transition-all duration-300 font-medium shadow-lg shadow-brand-primary/25 text-xs sm:text-sm"
              >
                {editingWarranty ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Warranties Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
        {warranties.map((warranty) => (
          <div
            key={warranty.id}
            className={`bg-brand-dark/30 border rounded-lg sm:rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-200 hover:shadow-lg ${
              warranty.is_active ? 'border-green-500/20' : 'border-white/10'
            }`}
          >
            {/* Status Badge & Icon */}
            <div className="flex items-center justify-between px-2 py-1.5 sm:px-3 sm:py-2 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-brand-primary/20 rounded-lg flex items-center justify-center">
                  <ShieldCheckIcon className="w-3 h-3 sm:w-4 sm:h-4 text-brand-primary" />
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <ClockIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                  <span className="text-[10px] sm:text-xs font-medium text-white">{warranty.duration_months} months</span>
                </div>
              </div>
              <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                warranty.is_active
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {warranty.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Warranty Info */}
            <div className="p-2 sm:p-3 lg:p-4">
              <h3 className="text-xs sm:text-sm lg:text-base font-bold text-white mb-1 sm:mb-2 line-clamp-1">
                {warranty.name}
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-400 mb-2 sm:mb-3 line-clamp-2">{warranty.description}</p>

              {/* Coverage Details Preview */}
              <div className="bg-white/5 border border-white/10 p-1.5 sm:p-2 lg:p-3 rounded-lg mb-2 sm:mb-3">
                <p className="text-[10px] sm:text-xs text-gray-300 line-clamp-2 sm:line-clamp-3">
                  {warranty.coverage_details}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-1 sm:gap-1.5 lg:gap-2">
                <button
                  onClick={() => handleEdit(warranty)}
                  className="flex-1 flex items-center justify-center gap-1 px-1.5 py-1 sm:px-2 sm:py-1.5 lg:px-3 lg:py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors text-[10px] sm:text-xs font-medium border border-blue-500/20"
                >
                  <PencilIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  onClick={() => handleToggleActive(warranty)}
                  className={`flex items-center justify-center gap-1 px-1.5 py-1 sm:px-2 sm:py-1.5 lg:px-3 lg:py-2 rounded-lg transition-colors text-[10px] sm:text-xs font-medium border ${
                    warranty.is_active
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                      : 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20'
                  }`}
                >
                  <span className="hidden sm:inline">{warranty.is_active ? 'Deactivate' : 'Activate'}</span>
                  <span className="sm:hidden">{warranty.is_active ? 'Off' : 'On'}</span>
                </button>
                <button
                  onClick={() => handleDelete(warranty.id)}
                  className="flex items-center justify-center px-1.5 py-1 sm:px-2 sm:py-1.5 lg:px-3 lg:py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-[10px] sm:text-xs font-medium border border-red-500/20"
                >
                  <TrashIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {warranties.length === 0 && !showForm && (
        <div className="text-center py-8 sm:py-12 bg-brand-dark/30 border border-white/10 rounded-lg sm:rounded-xl backdrop-blur-sm">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 bg-white/5 rounded-full mb-3 sm:mb-4 lg:mb-6">
            <ShieldCheckIcon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 text-gray-500" />
          </div>
          <h3 className="text-sm sm:text-lg lg:text-2xl font-bold text-white mb-1 sm:mb-2">No warranties yet</h3>
          <p className="text-[10px] sm:text-xs lg:text-sm text-gray-400 mb-3 sm:mb-4">Start by creating your first warranty coverage plan</p>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center gap-1 sm:gap-2 bg-brand-primary text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-brand-primary/90 transition-colors text-xs sm:text-sm font-medium"
          >
            <PlusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            Create Warranty
          </button>
        </div>
      )}
    </div>
  );
}