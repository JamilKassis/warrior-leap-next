'use client';

import React from 'react';
import { Package } from 'lucide-react';
import type { ProductFormData } from '../../types';
import { ImageUpload } from '../image-upload';

interface BasicInfoSectionProps {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ formData, setFormData }) => {
  const handleImagesChange = (images: {url: string; alt: string; isPrimary: boolean}[]) => {
    // Update both images array and the primary image_url for backward compatibility
    const primaryImage = images.find(img => img.isPrimary);
    setFormData(prev => ({ 
      ...prev, 
      images: images,
      image_url: primaryImage?.url || images[0]?.url || ''
    }));
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
        <div className="p-2 bg-brand-light rounded-lg">
          <Package className="w-4 h-4 text-brand-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
          <p className="text-gray-600 text-xs">Essential product details and description</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200 font-medium bg-white text-gray-900"
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200 resize-none bg-white text-gray-900"
              placeholder="Describe your product in detail..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">Provide a compelling description that highlights key benefits</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <div className="relative">
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary appearance-none bg-white transition-all duration-200 text-gray-900"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-1 text-sm">Quick Tips</h4>
            <ul className="text-xs text-blue-800 space-y-0.5">
              <li>• Use clear, descriptive names</li>
              <li>• Write compelling descriptions</li>
              <li>• Set status to inactive for drafts</li>
              <li>• Drag products in the list to reorder</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Updated Image Upload Section */}
      <div>
        <ImageUpload 
          images={formData.images || []}
          onImagesChange={handleImagesChange}
          maxImages={5}
        />
        <div className="mt-2 p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <h4 className="font-semibold text-green-900 mb-1 text-sm">📸 Image Guidelines</h4>
          <ul className="text-xs text-green-800 space-y-0.5">
            <li>• Upload multiple product images for better showcase</li>
            <li>• The first image will be set as primary automatically</li>
            <li>• Click the "Set as Primary" button to change the main image</li>
            <li>• Use high-quality images (recommended: 1200x1200 or larger)</li>
          </ul>
        </div>
      </div>
    </section>
  );
}; 