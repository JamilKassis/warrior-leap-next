export interface Product {
  id: string;
  name: string;
  description: string;
  seo_description?: string;
  price: number;
  original_price?: number;
  preorder_price?: number;
  deposit_amount?: number;
  image_url: string;
  features: (string | ProductFeature)[];
  specifications?: ProductSpecification[];
  warranty_id?: string;
  status?: 'active' | 'inactive';
  display_order?: number;
  images?: ProductImage[];
  created_at: string;
  updated_at: string;
}

export interface Inventory {
  id: string;
  product_id: string;
  location_id?: string;
  stock_quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  reorder_point: number;
  last_stock_update: string;
  created_at: string;
  updated_at: string;
}

export interface ProductWithInventory extends Product {
  stock_quantity?: number;
  reserved_quantity?: number;
  available_quantity?: number;
  reorder_point?: number;
  location_id?: string;
  last_stock_update?: string;
  computed_status: 'active' | 'inactive' | 'out_of_stock';
  needs_reorder: boolean;
}

export interface ProductFeature {
  text: string;
  icon: string;
}

export interface ProductSpecification {
  title: string;
  description: string;
  icon?: string;
}

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface StockAdjustment {
  product_id: string;
  old_quantity: number;
  adjustment: number;
  new_quantity: number;
  reason?: string;
  timestamp: string;
}

export interface StockReservation {
  id: string;
  product_id: string;
  quantity: number;
  reserved_at: string;
  expires_at?: string;
  order_id?: string;
  status: 'active' | 'fulfilled' | 'expired' | 'cancelled';
}

export interface InventoryStatus {
  product_id: string;
  product_name: string;
  computed_status: 'active' | 'inactive' | 'out_of_stock';
  stock_quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  reorder_point: number;
  needs_reorder: boolean;
  price?: number;
  description?: string;
}

export interface ReorderAlert {
  product_id: string;
  product_name: string;
  current_stock: number;
  available_stock: number;
  reorder_point: number;
  days_until_stockout?: number;
}

export const computeProductStatus = (
  inventory: Pick<Inventory, 'available_quantity'>,
  productStatus?: 'active' | 'inactive'
): 'active' | 'inactive' | 'out_of_stock' => {
  if (productStatus === 'inactive') return 'inactive';
  if (inventory.available_quantity > 0) return 'active';
  return 'out_of_stock';
};
