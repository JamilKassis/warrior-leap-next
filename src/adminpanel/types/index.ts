// Import the main types from the separated inventory system
import type {
  Product,
  Inventory,
  ProductWithInventory,
  InventoryStatus,
  ReorderAlert,
  StockAdjustment,
  ProductImage,
  ProductFeature
} from '@/types/inventory';

// Re-export for convenience
export type {
  Product,
  Inventory,
  ProductWithInventory,
  InventoryStatus,
  ReorderAlert,
  StockAdjustment,
  ProductImage,
  ProductFeature
};

// Admin-specific types
export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  permissions: string[];
  created_at: string;
  last_login?: string;
}

export interface AdminSession {
  user: AdminUser;
  token: string;
  expires_at: string;
}

// Audit logging
export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  resource_type: 'product' | 'inventory' | 'order' | 'user';
  resource_id: string;
  details: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Dashboard analytics
export interface DashboardStats {
  products: {
    total: number;
    active: number;
    inactive: number;
    out_of_stock: number;
    low_stock: number;
  };
  inventory: {
    total_value: number;
    reorder_alerts: number;
    stock_movements_today: number;
    reserved_stock_value: number;
  };
  orders: {
    pending: number;
    processing: number;
    completed_today: number;
    revenue_today: number;
  };
}

// Product management specific
export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  deposit_amount?: number;
  image_url: string;
  features: string[];
  specifications?: ProductSpecification[];
  warranty_id?: string;
  status: 'active' | 'inactive';
  stock_quantity: number;
  reorder_point: number;
  computed_status: 'active' | 'inactive' | 'out_of_stock';
  needs_reorder: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductSpecification {
  title: string;
  description: string;
  icon?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  original_price?: number | null;
  preorder_price?: number | null;
  deposit_amount?: number | null;
  image_url: string;
  features: (string | ProductFeature)[];
  specifications?: ProductSpecification[];
  warranty_id?: string;
  status: 'active' | 'inactive';
  display_order?: number;
  images?: {
    url: string;
    alt: string;
    isPrimary: boolean;
  }[];
}

// Inventory management specific
export interface InventoryFormData {
  stock_quantity: number;
  reorder_point: number;
}

// Bulk operations
export interface BulkOperation {
  id: string;
  type: 'stock_update' | 'price_update' | 'status_change';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total_items: number;
  completed_items: number;
  failed_items: number;
  errors: string[];
  created_at: string;
  completed_at?: string;
}

// Stock movements for audit trail
export interface StockMovement {
  id: string;
  product_id: string;
  product_name: string;
  movement_type: 'adjustment' | 'sale' | 'return' | 'transfer' | 'recount';
  quantity_before: number;
  quantity_change: number;
  quantity_after: number;
  location_id?: string;
  reason: string;
  admin_id: string;
  created_at: string;
}

// Inventory alerts
export interface InventoryAlert {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'overstock';
  product_id: string;
  product_name: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  acknowledged: boolean;
  acknowledged_by?: string;
  created_at: string;
  acknowledged_at?: string;
}

// Settings and configuration
export interface AdminSettings {
  inventory: {
    default_reorder_point: number;
    low_stock_threshold: number;
    auto_reorder_enabled: boolean;
    stock_reservation_timeout: number; // minutes
  };
  notifications: {
    email_alerts: boolean;
    low_stock_notifications: boolean;
    order_notifications: boolean;
  };
  system: {
    currency: string;
    timezone: string;
    date_format: string;
    items_per_page: number;
  };
}

export interface Testimonial {
  id: string;
  author: string;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalProducts: number;
  activeProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  monthlyRevenue: number;
  recentOrders: AdminOrder[];
  lowStockAlerts: LowStockAlert[];
}

export interface AdminOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total_amount: number;
  order_status: string;
  created_at: string;
}

export interface LowStockAlert {
  product_id: string;
  product_name: string;
  current_stock: number;
  reorder_point: number;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  topProducts: TopProduct[];
  revenueChart: ChartData[];
  ordersChart: ChartData[];
}

export interface TopProduct {
  id: string;
  name: string;
  revenue: number;
  orders: number;
}

export interface ChartData {
  date: string;
  value: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 