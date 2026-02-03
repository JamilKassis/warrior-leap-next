'use client';

import React, { useState } from 'react';
import { Save, Package } from 'lucide-react';

interface InventoryData {
  stock_quantity: number;
  reorder_point: number;
}

interface Props {
  data?: InventoryData;
  onUpdate: (data: InventoryData) => void;
  isLoading?: boolean;
}

export function InventorySection({ data, onUpdate, isLoading = false }: Props) {
  const [inventoryData, setInventoryData] = useState<InventoryData>({
    stock_quantity: data?.stock_quantity || 0,
    reorder_point: data?.reorder_point || 5,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateInventoryField = (field: keyof InventoryData, value: number) => {
    setInventoryData(prev => {
      const updated = { ...prev, [field]: value };
      setHasChanges(true);
      return updated;
    });
  };

  const handleSave = () => {
    onUpdate(inventoryData);
    setHasChanges(false);
  };

  const resetToOriginal = () => {
    setInventoryData({
      stock_quantity: data?.stock_quantity || 0,
      reorder_point: data?.reorder_point || 5,
    });
    setHasChanges(false);
  };

  React.useEffect(() => {
    if (data) {
      setInventoryData({
        stock_quantity: data.stock_quantity || 0,
        reorder_point: data.reorder_point || 5,
      });
      setHasChanges(false);
    }
  }, [data]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Package className="w-5 h-5 text-brand-primary mr-2" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Inventory Management</h3>
            <p className="text-gray-600 text-xs">Stock management settings</p>
          </div>
        </div>
        
        {hasChanges && (
          <div className="flex items-center space-x-2">
            <button
              onClick={resetToOriginal}
              className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 border border-gray-300 rounded"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stock Quantity */}
        <div>
          <label htmlFor="stock_quantity" className="block text-sm font-semibold text-gray-700 mb-2">
            Stock Quantity
          </label>
          <input
            type="number"
            id="stock_quantity"
            min="0"
            value={inventoryData.stock_quantity}
            onChange={(e) => updateInventoryField('stock_quantity', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary bg-white text-gray-900"
            placeholder="Enter stock quantity"
          />
          <p className="text-xs text-gray-500 mt-1">Current available stock</p>
        </div>

        {/* Reorder Point */}
        <div>
          <label htmlFor="reorder_point" className="block text-sm font-semibold text-gray-700 mb-2">
            Reorder Point
          </label>
          <input
            type="number"
            id="reorder_point"
            min="0"
            value={inventoryData.reorder_point}
            onChange={(e) => updateInventoryField('reorder_point', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary bg-white text-gray-900"
            placeholder="Enter reorder point"
          />
          <p className="text-xs text-gray-500 mt-1">Alert when stock reaches this level</p>
        </div>
      </div>

      {/* Status Preview */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Current Status</h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-gray-600">Stock:</span>
              <span className="font-semibold ml-1">{inventoryData.stock_quantity} units</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Status:</span>
              <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                inventoryData.stock_quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {inventoryData.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 