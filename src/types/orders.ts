export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  description?: string;
  urlFriendlyName?: string;
  status?: string;
  depositAmount?: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cash_on_delivery' | 'online' | 'bank_transfer' | 'wish_money';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export interface StatusTransition {
  from: OrderStatus;
  to: OrderStatus;
  label: string;
  description: string;
  requiresPayment?: boolean;
  requiresTracking?: boolean;
  requiresAdminNotes?: boolean;
  automatable?: boolean;
  conditions?: {
    paymentStatus?: PaymentStatus[];
  };
}

export interface OrderStatusWorkflow {
  currentStatus: OrderStatus;
  availableTransitions: StatusTransition[];
  nextAutomaticStatus?: OrderStatus;
  estimatedProgressPercentage: number;
}

export interface Order {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
  order_number: string;
  order_status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  items: CartItem[];
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
  admin_notes?: string;
  tracking_number?: string;
  estimated_delivery_date?: string;
  actual_delivery_date?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

export interface CreateOrderData {
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  tax_amount?: number;
  shipping_amount?: number;
  discount_amount?: number;
  total_amount: number;
  payment_method?: PaymentMethod;
  initial_order_status?: OrderStatus;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

export interface UpdateOrderData {
  order_status?: OrderStatus;
  payment_status?: PaymentStatus;
  admin_notes?: string;
  tracking_number?: string;
  estimated_delivery_date?: string;
  actual_delivery_date?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

export interface OrdersFilters {
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  date_from?: string;
  date_to?: string;
  search?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  has_preorder_items?: boolean;
}

export const ORDER_WORKFLOW_CONFIG: StatusTransition[] = [
  { from: 'pending', to: 'confirmed', label: 'Confirm Order', description: 'Confirm order and begin processing', automatable: true },
  { from: 'pending', to: 'cancelled', label: 'Cancel Order', description: 'Cancel pending order', requiresAdminNotes: true },
  { from: 'confirmed', to: 'processing', label: 'Start Processing', description: 'Begin processing and preparing order', automatable: true },
  { from: 'confirmed', to: 'cancelled', label: 'Cancel Order', description: 'Cancel confirmed order', requiresAdminNotes: true },
  { from: 'processing', to: 'shipped', label: 'Ship Order', description: 'Order has been shipped to customer', requiresTracking: true, automatable: true },
  { from: 'processing', to: 'cancelled', label: 'Cancel Order', description: 'Cancel order during processing', requiresAdminNotes: true },
  { from: 'shipped', to: 'delivered', label: 'Mark as Delivered', description: 'Order has been successfully delivered', automatable: true },
  { from: 'cancelled', to: 'pending', label: 'Restore Order', description: 'Restore cancelled order to pending status', requiresAdminNotes: true },
];

export const getOrderProgressPercentage = (status: OrderStatus): number => {
  const progressMap: Record<OrderStatus, number> = {
    pending: 20,
    confirmed: 40,
    processing: 60,
    shipped: 80,
    delivered: 100,
    cancelled: 0,
  };
  return progressMap[status] || 0;
};

export const getAvailableTransitions = (
  currentStatus: OrderStatus,
  paymentStatus: PaymentStatus
): StatusTransition[] => {
  return ORDER_WORKFLOW_CONFIG.filter((transition) => {
    if (transition.from !== currentStatus) return false;
    if (transition.conditions?.paymentStatus) {
      return transition.conditions.paymentStatus.includes(paymentStatus);
    }
    return true;
  });
};

export const getNextAutomaticStatus = (
  currentStatus: OrderStatus,
  paymentStatus: PaymentStatus
): OrderStatus | null => {
  const availableTransitions = getAvailableTransitions(currentStatus, paymentStatus);
  const automaticTransition = availableTransitions.find((t) => t.automatable);
  return automaticTransition?.to || null;
};

export const canTransitionTo = (
  currentStatus: OrderStatus,
  targetStatus: OrderStatus,
  paymentStatus: PaymentStatus
): boolean => {
  const availableTransitions = getAvailableTransitions(currentStatus, paymentStatus);
  return availableTransitions.some((t) => t.to === targetStatus);
};
