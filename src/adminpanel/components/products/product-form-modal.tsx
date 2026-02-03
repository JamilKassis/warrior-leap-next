'use client';

import React from 'react';
import { X } from 'lucide-react';
import type { Product, ProductFormData } from '../../types';
import { BasicInfoSection } from './basic-info-section';
import { PricingSection } from './pricing-section';
import { FeaturesSection } from './features-section';
import { SpecificationsSection } from './specifications-section';

interface ProductFormModalProps {
  showForm: boolean;
  editingProduct: Product | null;
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  showForm,
  editingProduct,
  formData,
  setFormData,
  loading,
  onSubmit,
  onClose
}) => {
  if (!showForm) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-3 lg:p-4 z-50">
      <div className="bg-white rounded-xl sm:rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-100">
        {/* Enhanced Header */}
        <div className="border-b border-gray-200 px-3 py-3 sm:px-5 sm:py-4 lg:px-8 lg:py-6 bg-gradient-to-r from-brand-primary to-brand-primary/90">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-xl lg:text-2xl font-bold text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-brand-light/80 mt-0.5 sm:mt-1 text-[10px] sm:text-xs lg:text-sm">
                {editingProduct ? 'Update product information and settings' : 'Create a new product for your catalog'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 p-1.5 sm:p-2 rounded-lg"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </button>
          </div>
        </div>

        {/* Enhanced Form */}
        <div className="overflow-y-auto max-h-[calc(95vh-140px)] sm:max-h-[calc(95vh-160px)] lg:max-h-[calc(95vh-180px)]">
          <form onSubmit={onSubmit} className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
            <BasicInfoSection formData={formData} setFormData={setFormData} />
            <PricingSection formData={formData} setFormData={setFormData} />
            <FeaturesSection formData={formData} setFormData={setFormData} />
            <SpecificationsSection formData={formData} setFormData={setFormData} />
          </form>
        </div>

        {/* Enhanced Footer */}
        <div className="border-t border-gray-200 px-3 py-3 sm:px-5 sm:py-4 lg:px-8 lg:py-6 bg-white">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3 lg:gap-4">
            <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600 text-center sm:text-left">
              {editingProduct ? 'Changes will be saved immediately' : 'Product will be created with the specified details'}
            </div>
            <div className="flex space-x-2 sm:space-x-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold text-xs sm:text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={onSubmit}
                disabled={loading}
                className="flex-1 sm:flex-none px-4 py-2 sm:px-6 sm:py-2.5 lg:px-8 lg:py-3 bg-brand-primary text-white rounded-lg sm:rounded-xl hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold hover:shadow-lg text-xs sm:text-sm"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  editingProduct ? 'Update Product' : 'Create Product'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
