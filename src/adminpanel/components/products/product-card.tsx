'use client';

import React from 'react';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import type { Product } from '../../types';

interface ExtendedProduct extends Omit<Product, 'status'> {
  original_price?: number;
  status?: 'active' | 'inactive' | 'out_of_stock' | 'preorder';
  warranty_id?: string;
  category?: string;
}

interface ProductCardProps {
  product: ExtendedProduct;
  onEdit: (product: ExtendedProduct) => void;
  onDelete: (id: string) => void;
  onView?: (product: ExtendedProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onEdit, 
  onDelete, 
  onView 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'out_of_stock':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preorder':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'inactive':
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return '🟢';
      case 'out_of_stock':
        return '🟡';
      case 'preorder':
        return '🔵';
      case 'inactive':
      default:
        return '🔴';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').toUpperCase();
  };

  const status = product.status || 'active';

  return (
    <div className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden border border-gray-100">
      {/* Status Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
          <span className="mr-1">{getStatusIcon(status)}</span>
          {formatStatus(status)}
        </span>
      </div>

      {/* Product Image */}
      <div className="relative h-48 bg-brand-light/20 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-200 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-product.png';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brand-light/30">
            <div className="text-center">
              <div className="text-4xl mb-2">📦</div>
              <p className="text-sm text-brand-dark/60">No Image</p>
            </div>
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/10 transition-all duration-200" />
      </div>

      {/* Product Content */}
      <div className="p-6">
        {/* Product Title & Category */}
        <div className="mb-3">
          <h3 className="text-xl font-semibold text-brand-dark line-clamp-1 mb-1">
            {product.name}
          </h3>
          {product.category && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-brand-light text-brand-dark">
              {product.category}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-base text-brand-dark/70 line-clamp-2 mb-4">
          {product.description}
        </p>

        {/* Pricing */}
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-2xl font-bold text-green-600">
            ${product.price.toFixed(2)}
          </span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-lg text-gray-500 line-through">
              ${product.original_price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Features Preview */}
        {product.features && product.features.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-brand-dark mb-2">Key Features:</p>
            <div className="space-y-1">
              {product.features.slice(0, 2).map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-brand-dark/70">
                  <span className="w-1.5 h-1.5 bg-brand-primary rounded-full mr-2" />
                  {typeof feature === 'string' ? feature : feature.text}
                </div>
              ))}
              {product.features.length > 2 && (
                <p className="text-xs text-brand-dark/50">
                  +{product.features.length - 2} more features
                </p>
              )}
            </div>
          </div>
        )}

        {/* Created Date */}
        <div className="text-xs text-brand-dark/50 mb-4">
          Created: {new Date(product.created_at).toLocaleDateString()}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {onView && (
            <button
              onClick={() => onView(product)}
              className="flex-1 flex items-center justify-center px-3 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg bg-brand-light text-brand-dark hover:bg-brand-light/80 active:scale-95"
            >
              <EyeIcon className="w-4 h-4 mr-2" />
              View
            </button>
          )}
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center px-3 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg bg-brand-primary text-white hover:bg-brand-primary/90 active:scale-95"
          >
            <PencilIcon className="w-4 h-4 mr-2" />
            Edit
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
                onDelete(product.id);
              }
            }}
            className="flex items-center justify-center px-3 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg bg-red-600 text-white hover:bg-red-700 active:scale-95"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 