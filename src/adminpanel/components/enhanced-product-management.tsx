'use client';

import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Search, Plus, Edit2, Trash2, Package, Copy, GripVertical } from 'lucide-react';
import type { Product, ProductFormData } from '../types';
import { ProductFormModal } from './products/product-form-modal';

// Type for database product image records
interface DbProductImage {
  image_url: string;
  image_alt: string;
  is_primary: boolean;
  sort_order?: number;
}

// Type for product data from database with images
interface DbProductWithImages extends Omit<Product, 'images'> {
  product_images?: DbProductImage[];
}

export function EnhancedProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [draggedProduct, setDraggedProduct] = useState<Product | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    original_price: undefined,
    preorder_price: undefined,
    deposit_amount: undefined,
    image_url: '',
    features: [],
    specifications: [],
    warranty_id: undefined,
    status: 'active',
    display_order: 0,
    images: []
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const supabase = getSupabaseClient();

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (
            image_url,
            image_alt,
            is_primary,
            sort_order
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to include images array for compatibility
      const transformedData = (data as DbProductWithImages[] | null)?.map((product) => ({
        ...product,
        images: product.product_images?.map((img) => ({
          url: img.image_url,
          alt: img.image_alt,
          isPrimary: img.is_primary
        })).sort((a, b) => {
          const aOrder = product.product_images?.find((img) => img.image_url === a.url)?.sort_order || 0;
          const bOrder = product.product_images?.find((img) => img.image_url === b.url)?.sort_order || 0;
          return aOrder - bOrder;
        }) || []
      })) || [];

      setProducts(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      original_price: undefined,
      preorder_price: undefined,
      deposit_amount: undefined,
      image_url: '',
      features: [],
      specifications: [],
      warranty_id: undefined,
      status: 'active',
      display_order: 0,
      images: []
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const supabase = getSupabaseClient();

    try {
      setLoading(true);

      // Prepare the product data for saving
      const productData = {
        ...formData,
        // Ensure the primary image is set in image_url for backward compatibility
        image_url: formData.images?.find(img => img.isPrimary)?.url || formData.images?.[0]?.url || formData.image_url
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;

        // If product_images table exists, update it as well
        if (formData.images && formData.images.length > 0) {
          // First, delete existing product images
          await supabase
            .from('product_images')
            .delete()
            .eq('product_id', editingProduct.id);

          // Then insert new images
          const productImages = formData.images.map((img, index) => ({
            product_id: editingProduct.id,
            image_url: img.url,
            image_alt: img.alt,
            is_primary: img.isPrimary,
            sort_order: index
          }));

          await supabase
            .from('product_images')
            .insert(productImages);
        }
      } else {
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert([productData])
          .select()
          .single();

        if (error) throw error;

        // If product_images table exists and we have images, insert them
        if (newProduct && formData.images && formData.images.length > 0) {
          const productImages = formData.images.map((img, index) => ({
            product_id: newProduct.id,
            image_url: img.url,
            image_alt: img.alt,
            is_primary: img.isPrimary,
            sort_order: index
          }));

          await supabase
            .from('product_images')
            .insert(productImages);
        }
      }

      await fetchProducts();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      original_price: product.original_price,
      preorder_price: product.preorder_price,
      deposit_amount: product.deposit_amount,
      image_url: product.image_url,
      features: product.features || [],
      specifications: product.specifications || [],
      warranty_id: product.warranty_id,
      status: product.status || 'active',
      display_order: product.display_order || 0,
      images: product.images || []
    });
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure? This will also remove inventory data and product images.')) return;
    const supabase = getSupabaseClient();

    try {
      setLoading(true);

      // Delete product images first (if the table exists)
      await supabase
        .from('product_images')
        .delete()
        .eq('product_id', productId);

      // Then delete the product (this will cascade to inventory due to foreign key)
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async (productId: string) => {
    const supabase = getSupabaseClient();

    try {
      setLoading(true);

      // Get the original product with all its data
      const { data: originalProduct, error: fetchError } = await supabase
        .from('products')
        .select(`
          *,
          product_images (
            image_url,
            image_alt,
            is_primary,
            sort_order
          )
        `)
        .eq('id', productId)
        .single();

      if (fetchError) throw fetchError;
      if (!originalProduct) throw new Error('Product not found');

      // Create a copy of the product with modified name and without id/timestamps
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, created_at: _created_at, updated_at: _updated_at, product_images, ...productData } = originalProduct;
      const duplicatedProduct = {
        ...productData,
        name: `${originalProduct.name} (Copy)`,
      };

      // Insert the duplicated product
      const { data: newProduct, error } = await supabase
        .from('products')
        .insert([duplicatedProduct])
        .select()
        .single();

      if (error) throw error;

      // If the original product had images, duplicate those too
      if (product_images && product_images.length > 0) {
        const productImages = (product_images as DbProductImage[]).map((img) => ({
          product_id: newProduct.id,
          image_url: img.image_url,
          image_alt: img.image_alt,
          is_primary: img.is_primary,
          sort_order: img.sort_order
        }));

        await supabase
          .from('product_images')
          .insert(productImages);
      }

      await fetchProducts();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to duplicate product');
    } finally {
      setLoading(false);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, product: Product) => {
    setDraggedProduct(product);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetProduct: Product) => {
    e.preventDefault();

    if (!draggedProduct || draggedProduct.id === targetProduct.id) {
      setDraggedProduct(null);
      return;
    }

    // Reorder products
    const sortedProducts = [...products].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    const draggedIndex = sortedProducts.findIndex(p => p.id === draggedProduct.id);
    const targetIndex = sortedProducts.findIndex(p => p.id === targetProduct.id);

    // Remove dragged product and insert at new position
    const newProducts = [...sortedProducts];
    newProducts.splice(draggedIndex, 1);
    newProducts.splice(targetIndex, 0, draggedProduct);

    // Update display_order for all products
    const updatedProducts = newProducts.map((p, index) => ({
      ...p,
      display_order: index + 1
    }));

    setProducts(updatedProducts);
    setDraggedProduct(null);

    // Save to database
    await saveProductOrder(updatedProducts);
  };

  const handleDragEnd = () => {
    setDraggedProduct(null);
  };

  const saveProductOrder = async (orderedProducts: Product[]) => {
    const supabase = getSupabaseClient();

    setSavingOrder(true);
    try {
      // Update each product's display_order
      const updates = orderedProducts.map((product, index) =>
        supabase
          .from('products')
          .update({ display_order: index + 1 })
          .eq('id', product.id)
      );

      await Promise.all(updates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product order');
    } finally {
      setSavingOrder(false);
    }
  };

  // Sort products by display_order for display
  const sortedProducts = [...products].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  const filteredProducts = sortedProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 sm:h-64">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white">Product Catalog</h1>
          <p className="text-[10px] sm:text-xs lg:text-sm text-gray-400 mt-0.5 sm:mt-1">
            Drag products to reorder. Order is saved automatically.
            {savingOrder && <span className="ml-1 sm:ml-2 text-brand-primary">Saving...</span>}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors font-medium shadow-sm text-xs sm:text-sm"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2" />
          Add Product
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-3 rounded-lg text-xs sm:text-sm">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-brand-dark/60 rounded-lg sm:rounded-xl border border-brand-primary/20 p-2 sm:p-3 lg:p-4 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-brand-light/60 w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-2 py-1.5 sm:pl-9 sm:pr-3 sm:py-2 lg:pl-10 lg:pr-4 lg:py-2 bg-brand-dark/40 border border-brand-primary/30 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-brand-light placeholder-brand-light/50 text-xs sm:text-sm"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 bg-brand-dark/40 border border-brand-primary/30 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-brand-light text-xs sm:text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2.5 lg:gap-3">
        {filteredProducts.map((product, index) => (
          <div
            key={product.id}
            draggable
            onDragStart={(e) => handleDragStart(e, product)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, product)}
            onDragEnd={handleDragEnd}
            className={`bg-brand-dark/50 rounded-lg sm:rounded-xl border overflow-hidden hover:shadow-xl hover:bg-brand-dark/70 transition-all duration-200 backdrop-blur-sm group cursor-move ${
              draggedProduct?.id === product.id
                ? 'border-brand-primary opacity-50'
                : 'border-brand-primary/20'
            }`}
          >
            {/* Drag Handle & Order Number */}
            <div className="flex items-center justify-between px-2 py-1 sm:px-2 sm:py-1.5 bg-brand-primary/10 border-b border-brand-primary/20">
              <div className="flex items-center gap-1 text-brand-light/70">
                <GripVertical className="w-3 h-3" />
                <span className="text-[10px] font-medium">#{index + 1}</span>
              </div>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${product.status === 'active'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
                }`}>
                {product.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Product Image */}
            <div className="h-20 sm:h-24 lg:h-28 relative overflow-hidden bg-gray-300">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-contain p-1 sm:p-2"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/api/placeholder/400/300';
                }}
              />
            </div>

            {/* Product Info */}
            <div className="p-2 sm:p-2.5 lg:p-3">
              <div className="flex justify-between items-start mb-1 sm:mb-1.5">
                <h3 className="font-semibold text-brand-light text-[11px] sm:text-xs lg:text-sm leading-tight pr-1 line-clamp-2">{product.name}</h3>
                <div className="text-right flex-shrink-0">
                  <div className="text-[11px] sm:text-xs lg:text-sm font-bold text-brand-primary">${product.price}</div>
                  {product.original_price && (
                    <div className="text-[9px] sm:text-[10px] text-brand-light/50 line-through">${product.original_price}</div>
                  )}
                </div>
              </div>

              <p className="text-brand-light/70 text-[9px] sm:text-[10px] lg:text-xs mb-1.5 sm:mb-2 line-clamp-2 leading-relaxed hidden sm:block">
                {product.description}
              </p>

              {product.features && product.features.length > 0 && (
                <div className="mb-1.5 sm:mb-2 hidden lg:block">
                  <div className="flex flex-wrap gap-1">
                    {product.features.slice(0, 2).map((feature, index) => {
                      const featureText = typeof feature === 'string' ? feature : feature.text;
                      return (
                        <span key={index} className="text-[9px] bg-brand-primary/20 text-brand-light px-1.5 py-0.5 rounded-full border border-brand-primary/30">
                          {featureText}
                        </span>
                      );
                    })}
                    {product.features.length > 2 && (
                      <span className="text-[9px] text-brand-light/50">+{product.features.length - 2} more</span>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-1">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="flex-1 px-1.5 py-1 sm:py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors text-[10px] font-medium flex items-center justify-center gap-1 border border-blue-500/30"
                >
                  <Edit2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  onClick={() => handleDuplicate(product.id)}
                  className="px-1.5 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors text-[10px] font-medium flex items-center justify-center border border-green-500/30"
                  title="Duplicate product"
                >
                  <Copy className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-1.5 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors text-[10px] font-medium border border-red-500/30"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-8 sm:py-12 bg-brand-dark/50 rounded-lg sm:rounded-xl border border-brand-primary/20 backdrop-blur-sm">
          <Package className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-brand-light/50 mx-auto mb-2 sm:mb-3 lg:mb-4" />
          <h3 className="text-sm sm:text-base lg:text-lg font-medium text-brand-light mb-1 sm:mb-2">
            {searchQuery || statusFilter !== 'all' ? 'No products found' : 'No products yet'}
          </h3>
          <p className="text-brand-light/60 mb-3 sm:mb-4 text-[10px] sm:text-xs lg:text-sm">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first product'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors font-medium text-xs sm:text-sm"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2" />
              Add Your First Product
            </button>
          )}
        </div>
      )}

      {/* Form Modal */}
      <ProductFormModal
        showForm={showForm}
        editingProduct={editingProduct}
        formData={formData}
        setFormData={setFormData}
        loading={loading}
        onSubmit={handleSubmit}
        onClose={resetForm}
      />
    </div>
  );
}
