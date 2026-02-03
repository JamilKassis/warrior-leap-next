'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, Save, X } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';

interface ProductWithInventory {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url: string;
  stock_quantity: number;
  reorder_point: number;
  computed_status: 'active' | 'inactive' | 'out_of_stock';
  needs_reorder: boolean;
}

export function InventoryManagement() {
  const [products, setProducts] = useState<ProductWithInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingStocks, setEditingStocks] = useState<{ [key: string]: number }>({});
  const [saving, setSaving] = useState<{ [key: string]: boolean }>({});

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from('products_with_inventory')
        .select('*')
        .order('name');

      if (error) throw error;

      setProducts(data || []);
      console.log(`Loaded ${data?.length || 0} products with inventory data`);
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId: string, newStock: number) => {
    try {
      setSaving(prev => ({ ...prev, [`stock_${productId}`]: true }));

      const supabase = getSupabaseClient();

      const { error } = await supabase.rpc('update_product_stock', {
        p_product_id: productId,
        p_new_quantity: newStock
      });

      if (error) throw error;

      // Update local state
      setProducts(prev => prev.map(item =>
        item.id === productId
          ? {
            ...item,
            stock_quantity: newStock,
            computed_status: newStock > 0 ? 'active' : 'out_of_stock'
          }
          : item
      ));

      // Clear editing state
      setEditingStocks(prev => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });

      console.log(`Stock updated for product ${productId}: ${newStock}`);
    } catch (err) {
      console.error('Error updating stock:', err);
      setError(err instanceof Error ? err.message : 'Failed to update stock');
    } finally {
      setSaving(prev => ({ ...prev, [`stock_${productId}`]: false }));
    }
  };

  const startEditingStock = (productId: string, currentStock: number) => {
    setEditingStocks(prev => ({ ...prev, [productId]: currentStock }));
  };

  const saveStock = async (productId: string) => {
    const newStock = editingStocks[productId];
    if (newStock !== undefined) {
      await updateStock(productId, newStock);
    }
  };

  const cancelEditStock = (productId: string) => {
    setEditingStocks(prev => {
      const newState = { ...prev };
      delete newState[productId];
      return newState;
    });
  };

  const handleStockKeyPress = async (e: React.KeyboardEvent, productId: string) => {
    if (e.key === 'Enter') {
      await saveStock(productId);
    } else if (e.key === 'Escape') {
      cancelEditStock(productId);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const getStatusColor = (status: string, needsReorder: boolean) => {
    if (needsReorder) return 'text-red-600 bg-red-100';
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'out_of_stock':
        return 'text-yellow-600 bg-yellow-100';
      case 'inactive':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const lowStockProducts = products.filter(item => item.needs_reorder);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
        <span className="ml-2 text-gray-600">Loading inventory data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
          <div>
            <h3 className="text-red-400 font-semibold">Error</h3>
            <p className="text-red-300">{error}</p>
          </div>
        </div>
        <button
          onClick={loadProducts}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
        <div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Inventory Management</h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-400">Manage stock levels</p>
        </div>
        <button
          onClick={loadProducts}
          className="flex items-center justify-center px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors text-xs sm:text-sm lg:text-base"
        >
          <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Refresh
        </button>
      </div>

      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg lg:rounded-xl p-2 sm:p-3 lg:p-6">
          <div className="flex items-center mb-2 sm:mb-3 lg:mb-4">
            <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-red-500 mr-1.5 sm:mr-2" />
            <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-red-400">Low Stock Alerts</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
            {lowStockProducts.map((item) => (
              <div key={item.id} className="bg-brand-dark/50 rounded-lg p-2 sm:p-3 lg:p-4 border border-red-500/20">
                <div className="flex items-center justify-between gap-1 sm:gap-2">
                  <div className="font-medium text-white truncate text-xs sm:text-sm lg:text-base">{item.name}</div>
                  <span className="text-[10px] sm:text-xs lg:text-sm text-red-400 font-semibold whitespace-nowrap">
                    {item.stock_quantity} left
                  </span>
                </div>
                <div className="text-[10px] sm:text-xs lg:text-sm text-gray-400 mt-0.5 sm:mt-1">
                  Reorder: {item.reorder_point}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Inventory */}
      <div className="bg-brand-dark/30 rounded-lg lg:rounded-xl shadow-lg border border-white/10 backdrop-blur-md">
        <div className="p-2 sm:p-3 lg:p-6">
          <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-2 sm:mb-3 lg:mb-4">Product Inventory</h2>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-2 sm:space-y-3">
            {products.map((item) => (
              <div key={item.id} className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/10">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <img
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover bg-white/10 flex-shrink-0"
                    src={item.image_url}
                    alt={item.name}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-white truncate">{item.name}</div>
                    <div className="text-[10px] sm:text-xs text-gray-400 truncate">{item.description}</div>
                    <div className="text-xs sm:text-sm font-semibold text-brand-primary mt-0.5 sm:mt-1">${item.price.toFixed(2)}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-1.5 sm:gap-2 pt-2 sm:pt-3 border-t border-white/10">
                  <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${getStatusColor(item.computed_status, item.needs_reorder)}`}>
                    {item.needs_reorder ? 'Low Stock' : item.computed_status}
                  </span>

                  <div className="flex items-center gap-1 sm:gap-2">
                    {editingStocks[item.id] !== undefined ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          value={editingStocks[item.id]}
                          onChange={(e) => setEditingStocks(prev => ({
                            ...prev,
                            [item.id]: parseInt(e.target.value) || 0
                          }))}
                          onKeyDown={(e) => handleStockKeyPress(e, item.id)}
                          className="w-12 sm:w-16 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm border border-white/20 rounded focus:ring-brand-primary focus:border-brand-primary bg-brand-dark/50 text-white"
                          autoFocus
                        />
                        <button
                          onClick={() => saveStock(item.id)}
                          disabled={saving[`stock_${item.id}`]}
                          className="p-1 sm:p-1.5 text-green-500 bg-green-500/10 rounded hover:bg-green-500/20 disabled:opacity-50"
                        >
                          <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => cancelEditStock(item.id)}
                          className="p-1 sm:p-1.5 text-gray-400 bg-white/5 rounded hover:bg-white/10"
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditingStock(item.id, item.stock_quantity)}
                        className="text-xs sm:text-sm text-white bg-white/5 hover:bg-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/10"
                      >
                        {item.stock_quantity} units
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-[10px] sm:text-xs text-gray-400 mt-1.5 sm:mt-2">
                  Reorder at: {item.reorder_point} units
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Stock Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Reorder Point
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {products.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5">
                    {/* Product Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={item.image_url}
                            alt={item.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white max-w-xs truncate">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-400 max-w-xs truncate">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.computed_status, item.needs_reorder)}`}>
                        {item.needs_reorder ? 'Low Stock' : item.computed_status}
                      </span>
                    </td>

                    {/* Stock Quantity */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingStocks[item.id] !== undefined ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            value={editingStocks[item.id]}
                            onChange={(e) => setEditingStocks(prev => ({
                              ...prev,
                              [item.id]: parseInt(e.target.value) || 0
                            }))}
                            onKeyDown={(e) => handleStockKeyPress(e, item.id)}
                            className="w-20 px-2 py-1 text-sm border border-white/20 rounded focus:ring-brand-primary focus:border-brand-primary bg-brand-dark/50 text-white"
                            autoFocus
                          />
                          <button
                            onClick={() => saveStock(item.id)}
                            disabled={saving[`stock_${item.id}`]}
                            className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => cancelEditStock(item.id)}
                            className="p-1 text-gray-400 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditingStock(item.id, item.stock_quantity)}
                          className="text-sm text-white hover:text-brand-primary hover:bg-white/5 px-2 py-1 rounded"
                        >
                          {item.stock_quantity} units
                        </button>
                      )}
                    </td>

                    {/* Reorder Point */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {item.reorder_point} units
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      ${item.price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}