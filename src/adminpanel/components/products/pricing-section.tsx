'use client';

import React from 'react';
import { DollarSign } from 'lucide-react';
import type { ProductFormData } from '../../types';

interface PricingSectionProps {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ formData, setFormData }) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
        <div className="p-2 bg-green-100 rounded-lg">
          <DollarSign className="w-4 h-4 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Pricing Structure</h3>
          <p className="text-gray-600 text-xs">Set up your product pricing and payment options</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Regular Price *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              className="w-full pl-7 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200 font-semibold bg-white text-gray-900"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Main selling price</p>
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Original Price
            <span className="text-xs font-normal text-gray-500 ml-1">(optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.original_price || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, original_price: e.target.value === '' ? null : parseFloat(e.target.value) }))}
              className="w-full pl-7 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200 bg-white text-gray-900"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">For showing discounts</p>
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Preorder Price
            <span className="text-xs font-normal text-gray-500 ml-1">(optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.preorder_price || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, preorder_price: e.target.value === '' ? null : parseFloat(e.target.value) }))}
              className="w-full pl-7 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200 bg-white text-gray-900"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Early bird pricing</p>
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Deposit Amount
            <span className="text-xs font-normal text-gray-500 ml-1">(optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.deposit_amount || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, deposit_amount: e.target.value === '' ? null : parseFloat(e.target.value) }))}
              className="w-full pl-7 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200 bg-white text-gray-900"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Partial payment option</p>
        </div>
      </div>
    </section>
  );
}; 