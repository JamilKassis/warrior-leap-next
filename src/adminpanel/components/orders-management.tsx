'use client';

import { useState, useEffect } from 'react';
import { useOrders } from '@/hooks/use-orders';
import {
  Order,
  OrderStatus,
  PaymentStatus,
  OrdersFilters,
  getAvailableTransitions,
  canTransitionTo,
  ORDER_WORKFLOW_CONFIG
} from '@/types/orders';
import {
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BanknotesIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface StatusChangeModal {
  isOpen: boolean;
  order: Order | null;
  targetStatus: OrderStatus | null;
}

interface DeleteConfirmModal {
  isOpen: boolean;
  order: Order | null;
}

interface OrderStats {
  totalOrders: number;
  confirmedOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  totalRevenue: number;
  todayOrders: number;
  urgentOrders: number;
}

interface StatusUpdateData {
  adminNotes?: string;
  trackingNumber?: string;
}

export function OrdersManagement() {
  const { orders, loading, error, fetchOrders, updateOrder, deleteOrder, getOrderStats } = useOrders();
  const [filters, setFilters] = useState<OrdersFilters>({});
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [statusChangeModal, setStatusChangeModal] = useState<StatusChangeModal>({
    isOpen: false,
    order: null,
    targetStatus: null
  });
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<DeleteConfirmModal>({
    isOpen: false,
    order: null
  });
  const [adminNotes, setAdminNotes] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    loadOrders();
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOrders = async () => {
    try {
      await fetchOrders(filters);
    } catch (err) {
      console.error('Error loading orders:', err);
    }
  };

  const loadStats = async () => {
    try {
      const orderStats = await getOrderStats();
      setStats(orderStats);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleFilterChange = (key: keyof OrdersFilters, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    loadOrders();
  };

  const handleClearFilters = () => {
    setFilters({});
    fetchOrders();
  };

  // Enhanced status update with workflow validation
  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Check if transition is allowed
    if (!canTransitionTo(order.order_status, newStatus, order.payment_status)) {
      alert('This status transition is not allowed based on current order state.');
      return;
    }

    // Find the transition config
    const availableTransitions = getAvailableTransitions(order.order_status, order.payment_status);
    const transition = availableTransitions.find(t => t.to === newStatus);

    if (!transition) {
      alert('Invalid status transition.');
      return;
    }

    // Check if additional information is required
    if (transition.requiresAdminNotes || transition.requiresTracking) {
      setStatusChangeModal({
        isOpen: true,
        order,
        targetStatus: newStatus
      });
      return;
    }

    // Proceed with simple status update
    await performStatusUpdate(orderId, newStatus);
  };

  const performStatusUpdate = async (orderId: string, newStatus: OrderStatus, additionalData?: StatusUpdateData) => {
    setUpdatingOrderId(orderId);
    try {
      const updateData: { order_status: OrderStatus; admin_notes?: string; tracking_number?: string } = { order_status: newStatus };

      // Add additional data if provided
      if (additionalData?.adminNotes) {
        updateData.admin_notes = additionalData.adminNotes;
      }
      if (additionalData?.trackingNumber) {
        updateData.tracking_number = additionalData.trackingNumber;
      }

      await updateOrder(orderId, updateData);
      loadOrders();
      loadStats();

      // Close modal if open
      setStatusChangeModal({ isOpen: false, order: null, targetStatus: null });
      setAdminNotes('');
      setTrackingNumber('');
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status. Please try again.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handlePaymentStatusUpdate = async (orderId: string, newStatus: PaymentStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrder(orderId, { payment_status: newStatus });
      loadOrders();
      loadStats();
    } catch (err) {
      console.error('Error updating payment status:', err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDeleteOrder = (order: Order) => {
    setDeleteConfirmModal({
      isOpen: true,
      order
    });
  };

  const confirmDeleteOrder = async () => {
    if (!deleteConfirmModal.order) return;

    const { id } = deleteConfirmModal.order;
    setUpdatingOrderId(id);

    try {
      await deleteOrder(id);
      loadStats();
      setDeleteConfirmModal({ isOpen: false, order: null });
    } catch (err) {
      console.error('Error deleting order:', err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-brand-primary/10 text-brand-primary',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-brand-primary/20 text-brand-primary',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      paid: 'bg-green-100 text-green-800',
      refunded: 'bg-orange-100 text-orange-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate total items quantity for an order
  const getTotalItemsCount = (order: Order) => {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  };

  // Check if order contains preorder items
  const hasPreorderItems = (order: Order) => {
    return order.items.some(item => item.status === 'preorder');
  };

  // Get available status transitions for an order
  const getOrderAvailableTransitions = (order: Order) => {
    return getAvailableTransitions(order.order_status, order.payment_status);
  };

  // Delete Confirmation Modal Component
  const DeleteConfirmModal = () => {
    if (!deleteConfirmModal.isOpen || !deleteConfirmModal.order) {
      return null;
    }

    const { order } = deleteConfirmModal;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-red-200">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full">
            <TrashIcon className="w-8 h-8 text-red-600" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Delete Order</h3>

          <div className="mb-6 text-center">
            <p className="text-gray-700 mb-3 text-base">
              Are you sure you want to delete order{' '}
              <span className="font-semibold text-gray-900">{order.order_number}</span>?
            </p>
            <p className="text-sm text-red-600 font-medium">
              This action cannot be undone.
            </p>

            {/* Order details for context */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-left">
              <div className="text-sm space-y-2 text-gray-800">
                <div><span className="font-medium text-gray-900">Customer:</span> <span className="text-gray-700">{order.customer_name}</span></div>
                <div><span className="font-medium text-gray-900">Total:</span> <span className="text-gray-700">${order.total_amount.toFixed(2)}</span></div>
                <div className="flex items-center"><span className="font-medium text-gray-900">Status:</span>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getStatusColor(order.order_status)}`}>
                    {order.order_status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setDeleteConfirmModal({ isOpen: false, order: null })}
              disabled={updatingOrderId === order.id}
              className="px-6 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteOrder}
              disabled={updatingOrderId === order.id}
              className="px-6 py-3 text-white bg-red-600 border border-red-600 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 transition-all duration-200 font-medium shadow-lg disabled:opacity-50 flex items-center"
            >
              {updatingOrderId === order.id ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Delete Order
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Status Change Modal Component
  const StatusChangeModal = () => {
    if (!statusChangeModal.isOpen || !statusChangeModal.order || !statusChangeModal.targetStatus) {
      return null;
    }

    const { order, targetStatus } = statusChangeModal;
    const transition = ORDER_WORKFLOW_CONFIG.find(t =>
      t.from === order.order_status && t.to === targetStatus
    );

    if (!transition) return null;

    const handleConfirm = () => {
      const additionalData: StatusUpdateData = {};

      if (transition.requiresAdminNotes && adminNotes.trim()) {
        additionalData.adminNotes = adminNotes.trim();
      }

      if (transition.requiresTracking && trackingNumber.trim()) {
        additionalData.trackingNumber = trackingNumber.trim();
      }

      // Validate required fields
      if (transition.requiresAdminNotes && !adminNotes.trim()) {
        alert('Admin notes are required for this status change.');
        return;
      }

      if (transition.requiresTracking && !trackingNumber.trim()) {
        alert('Tracking number is required for this status change.');
        return;
      }

      performStatusUpdate(order.id, targetStatus, additionalData);
    };

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-brand-primary/20">
          <h3 className="text-2xl font-bold text-brand-dark mb-6 text-center">Confirm Status Change</h3>

          <div className="mb-6">
            <p className="text-sm text-brand-dark/80 mb-3">
              Change order <strong>{order.order_number}</strong> status from{' '}
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.order_status)}`}>
                {order.order_status}
              </span>{' '}
              to{' '}
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(targetStatus)}`}>
                {targetStatus}
              </span>
            </p>
            <p className="text-sm text-brand-dark/60">{transition.description}</p>
          </div>

          {transition.requiresAdminNotes && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-brand-dark mb-2">
                Admin Notes <span className="text-red-500">*</span>
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Enter reason for this status change..."
                className="w-full px-4 py-3 bg-brand-light/30 border-2 border-brand-primary/30 rounded-xl focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all duration-300 resize-none text-brand-dark"
                rows={3}
              />
            </div>
          )}

          {transition.requiresTracking && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-brand-dark mb-2">
                Tracking Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number..."
                className="w-full px-4 py-3 bg-brand-light/30 border-2 border-brand-primary/30 rounded-xl focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all duration-300 text-brand-dark"
              />
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setStatusChangeModal({ isOpen: false, order: null, targetStatus: null })}
              className="px-6 py-3 text-brand-dark bg-brand-light/50 border-2 border-brand-primary/30 rounded-xl hover:bg-brand-light/70 hover:border-brand-primary/50 focus:outline-none focus:ring-4 focus:ring-brand-primary/20 transition-all duration-300 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-8 py-3 text-white bg-gradient-to-r from-brand-primary to-brand-dark border border-transparent rounded-xl hover:from-brand-primary/90 hover:to-brand-dark/90 focus:outline-none focus:ring-4 focus:ring-brand-primary/50 transition-all duration-300 font-medium shadow-lg shadow-brand-primary/25 transform hover:scale-105"
            >
              Confirm Change
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-brand-primary/60 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <XCircleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading orders</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-brand-primary rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
            <ClipboardDocumentListIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Orders Management</h2>
            <p className="text-xs sm:text-sm lg:text-base text-gray-400 hidden sm:block">View and manage customer orders, update status, and track deliveries</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
          <div className="bg-brand-dark/30 rounded-lg lg:rounded-xl shadow-lg border border-white/10 backdrop-blur-md p-2 sm:p-3 lg:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClipboardDocumentListIcon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-brand-primary" />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs lg:text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                  <dd className="text-sm sm:text-base lg:text-lg font-medium text-white">{stats.totalOrders}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-brand-dark/30 rounded-lg lg:rounded-xl shadow-lg border border-white/10 backdrop-blur-md p-2 sm:p-3 lg:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-green-600" />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs lg:text-sm font-medium text-gray-500 truncate">Confirmed</dt>
                  <dd className="text-sm sm:text-base lg:text-lg font-medium text-white">{stats.confirmedOrders}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-brand-dark/30 rounded-lg lg:rounded-xl shadow-lg border border-white/10 backdrop-blur-md p-2 sm:p-3 lg:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-yellow-600" />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs lg:text-sm font-medium text-gray-500 truncate">Pending</dt>
                  <dd className="text-sm sm:text-base lg:text-lg font-medium text-white">{stats.pendingOrders}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-brand-dark/30 rounded-lg lg:rounded-xl shadow-lg border border-white/10 backdrop-blur-md p-2 sm:p-3 lg:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BanknotesIcon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-green-600" />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs lg:text-sm font-medium text-gray-500 truncate">Revenue</dt>
                  <dd className="text-sm sm:text-base lg:text-lg font-medium text-white">{formatCurrency(stats.totalRevenue)}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-brand-dark/30 rounded-lg lg:rounded-xl shadow-lg border border-white/10 backdrop-blur-md p-2 sm:p-3 lg:p-6 col-span-2 sm:col-span-1">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-purple-600" />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs lg:text-sm font-medium text-gray-500 truncate">Today's Orders</dt>
                  <dd className="text-sm sm:text-base lg:text-lg font-medium text-white">{stats.todayOrders}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-brand-dark/30 rounded-lg lg:rounded-xl shadow-lg border border-white/10 backdrop-blur-md">
        <div className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base lg:text-lg font-medium text-white">Orders</h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 border-2 border-white/10 rounded-lg lg:rounded-xl text-xs lg:text-sm font-medium text-gray-300 bg-white/5 hover:bg-white/10 transition-all duration-300"
            >
              <FunnelIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 lg:mr-2" />
              <span className="hidden sm:inline">Filters</span>
              {showFilters ? (
                <ChevronUpIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1 lg:ml-2" />
              ) : (
                <ChevronDownIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1 lg:ml-2" />
              )}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 border-b border-white/10 bg-white/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Search</label>
                <div className="relative">
                  <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Order number, customer..."
                    value={filters.search || ''}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-8 sm:pl-10 w-full bg-brand-dark border-2 border-white/10 rounded-lg sm:rounded-xl px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all duration-300 placeholder-gray-500 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Status</label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full bg-brand-dark border-2 border-white/10 rounded-lg sm:rounded-xl px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all duration-300 text-white"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Payment</label>
                <select
                  value={filters.payment_status || ''}
                  onChange={(e) => handleFilterChange('payment_status', e.target.value)}
                  className="w-full bg-brand-dark border-2 border-white/10 rounded-lg sm:rounded-xl px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all duration-300 text-white"
                >
                  <option value="">All Payment Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">From Date</label>
                <input
                  type="date"
                  value={filters.date_from || ''}
                  onChange={(e) => handleFilterChange('date_from', e.target.value)}
                  className="w-full bg-brand-dark border-2 border-white/10 rounded-lg sm:rounded-xl px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all duration-300 text-white"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">To Date</label>
                <input
                  type="date"
                  value={filters.date_to || ''}
                  onChange={(e) => handleFilterChange('date_to', e.target.value)}
                  className="w-full bg-brand-dark border-2 border-white/10 rounded-lg sm:rounded-xl px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all duration-300 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 sm:space-x-3 mt-3 sm:mt-4">
              <button
                onClick={handleClearFilters}
                className="px-3 sm:px-6 py-2 sm:py-3 border-2 border-white/10 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-300 bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                Clear
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-3 sm:px-6 py-2 sm:py-3 bg-brand-primary text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:bg-brand-primary/90 transition-all duration-300 shadow-lg shadow-brand-primary/25"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Mobile Orders Cards */}
        <div className="lg:hidden p-2 sm:p-3 space-y-2 sm:space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/10">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-xs sm:text-sm font-medium text-white">{order.order_number}</div>
                  <div className="text-[10px] sm:text-xs text-gray-400">{getTotalItemsCount(order)} item(s)</div>
                </div>
                <div className="text-right">
                  <div className="text-xs sm:text-sm font-bold text-white">{formatCurrency(order.total_amount)}</div>
                  <div className="text-[10px] sm:text-xs text-gray-400">{formatDate(order.created_at)}</div>
                </div>
              </div>

              <div className="mb-2">
                <div className="text-xs sm:text-sm text-white">{order.customer_name}</div>
                <div className="text-[10px] sm:text-xs text-gray-400 truncate">{order.email}</div>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2">
                <select
                  value={order.order_status}
                  onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                  disabled={updatingOrderId === order.id}
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full border-0 ${getStatusColor(order.order_status)} ${updatingOrderId === order.id ? 'opacity-50' : ''}`}
                >
                  <option value={order.order_status}>{order.order_status}</option>
                  {getOrderAvailableTransitions(order).map(transition => (
                    transition.to !== order.order_status && (
                      <option key={transition.to} value={transition.to}>{transition.label}</option>
                    )
                  ))}
                </select>
                <select
                  value={order.payment_status}
                  onChange={(e) => handlePaymentStatusUpdate(order.id, e.target.value as PaymentStatus)}
                  disabled={updatingOrderId === order.id}
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full border-0 ${getPaymentStatusColor(order.payment_status)} ${updatingOrderId === order.id ? 'opacity-50' : ''}`}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                  <option value="failed">Failed</option>
                </select>
                {hasPreorderItems(order) && (
                  <span className="text-[10px] sm:text-xs text-blue-400 flex items-center">
                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full mr-1"></span>
                    Preorder
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium text-brand-primary bg-brand-primary/10 rounded-lg hover:bg-brand-primary/20 transition-colors"
                >
                  <EyeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  View Details
                </button>
                <button
                  onClick={() => handleDeleteOrder(order)}
                  disabled={updatingOrderId === order.id}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  <TrashIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Orders Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">{order.order_number}</div>
                      <div className="text-sm text-gray-400">{getTotalItemsCount(order)} item(s)</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">{order.customer_name}</div>
                      <div className="text-sm text-gray-400">{order.email}</div>
                      <div className="text-sm text-gray-400">{order.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.order_status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                      disabled={updatingOrderId === order.id}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-0 ${getStatusColor(order.order_status)} ${updatingOrderId === order.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                    >
                      {/* Current status is always shown */}
                      <option value={order.order_status}>{order.order_status}</option>

                      {/* Only show available transitions */}
                      {getOrderAvailableTransitions(order).map(transition => (
                        transition.to !== order.order_status && (
                          <option key={transition.to} value={transition.to}>
                            {transition.label}
                          </option>
                        )
                      ))}
                    </select>

                    {hasPreorderItems(order) && (
                      <div className="text-xs text-blue-600 mt-1 flex items-center">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                        Contains preorder items
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.payment_status}
                      onChange={(e) => handlePaymentStatusUpdate(order.id, e.target.value as PaymentStatus)}
                      disabled={updatingOrderId === order.id}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-0 ${getPaymentStatusColor(order.payment_status)} ${updatingOrderId === order.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="refunded">Refunded</option>
                      <option value="failed">Failed</option>
                    </select>
                    <div className="text-xs text-gray-400 mt-1">{order.payment_method}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {formatCurrency(order.total_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-brand-primary hover:text-brand-dark transition-colors"
                        title="View order details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order)}
                        disabled={updatingOrderId === order.id}
                        className={`text-red-500 hover:text-red-700 transition-colors ${updatingOrderId === order.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        title="Delete order"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
            <div className="text-center py-12">
              <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-white">No orders found</h3>
              <p className="mt-1 text-sm text-gray-400">
                {Object.keys(filters).length > 0
                  ? "Try adjusting your filters to see more results."
                  : "Orders will appear here once customers start placing them."}
              </p>
            </div>
          )}
        </div>

        {/* Mobile Empty State */}
        {orders.length === 0 && (
          <div className="lg:hidden text-center py-6 sm:py-8 px-2 sm:px-4">
            <ClipboardDocumentListIcon className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
            <h3 className="mt-2 text-xs sm:text-sm font-medium text-white">No orders found</h3>
            <p className="mt-1 text-[10px] sm:text-xs text-gray-400">
              {Object.keys(filters).length > 0
                ? "Try adjusting your filters."
                : "Orders will appear here once customers start placing them."}
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 p-2 sm:p-4">
          <div className="relative my-2 sm:my-4 lg:my-20 mx-auto p-2 sm:p-4 lg:p-5 border w-full max-w-4xl shadow-lg rounded-lg sm:rounded-xl bg-brand-dark border-white/10">
            <div className="flex justify-between items-start mb-2 sm:mb-4">
              <div>
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white">Order Details</h3>
                <p className="text-xs sm:text-sm text-gray-400">{selectedOrder.order_number}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white p-0.5 sm:p-1"
              >
                <XCircleIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4 lg:gap-6">
              {/* Customer Information */}
              <div className="bg-white/5 rounded-lg p-2 sm:p-3 lg:p-4 border border-white/10">
                <h4 className="text-xs sm:text-sm lg:text-md font-semibold text-white mb-2 sm:mb-3 flex items-center">
                  <PhoneIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1.5 sm:mr-2 text-brand-primary" />
                  Customer Information
                </h4>
                <div className="space-y-1.5 sm:space-y-2 lg:space-y-3 text-xs sm:text-sm">
                  <div>
                    <span className="font-medium text-gray-400">Name:</span>
                    <span className="ml-1.5 sm:ml-2 text-white">{selectedOrder.customer_name}</span>
                  </div>
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-gray-500" />
                    <span className="text-white text-[10px] sm:text-xs lg:text-sm break-all">{selectedOrder.email}</span>
                  </div>
                  <div className="flex items-center">
                    <PhoneIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-gray-500" />
                    <span className="text-white text-xs sm:text-sm">{selectedOrder.phone}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPinIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="text-white text-[10px] sm:text-xs lg:text-sm">
                      <div>{selectedOrder.address}</div>
                      <div>{selectedOrder.city}</div>
                    </div>
                  </div>
                  {selectedOrder.notes && (
                    <div className="pt-1.5 sm:pt-2 border-t border-white/10">
                      <span className="font-medium text-gray-400">Notes:</span>
                      <div className="mt-1 text-white text-[10px] sm:text-xs lg:text-sm">{selectedOrder.notes}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Information */}
              <div className="bg-white/5 rounded-lg p-2 sm:p-3 lg:p-4 border border-white/10">
                <h4 className="text-xs sm:text-sm lg:text-md font-semibold text-white mb-2 sm:mb-3 flex items-center">
                  <ClipboardDocumentListIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1.5 sm:mr-2 text-brand-primary" />
                  Order Information
                </h4>
                <div className="space-y-1.5 sm:space-y-2 lg:space-y-3 text-xs sm:text-sm">
                  <div>
                    <span className="font-medium text-gray-400">Order Number:</span>
                    <span className="ml-1.5 sm:ml-2 text-white font-mono text-[10px] sm:text-xs lg:text-sm">{selectedOrder.order_number}</span>
                  </div>
                  <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
                    <span className="font-medium text-gray-400">Status:</span>
                    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.order_status)}`}>
                      {selectedOrder.order_status}
                    </span>
                  </div>
                  <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
                    <span className="font-medium text-gray-400">Payment:</span>
                    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full ${getPaymentStatusColor(selectedOrder.payment_status)}`}>
                      {selectedOrder.payment_status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-400">Payment Method:</span>
                    <span className="ml-1.5 sm:ml-2 text-white capitalize text-xs sm:text-sm">{selectedOrder.payment_method.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-400">Order Date:</span>
                    <span className="ml-1.5 sm:ml-2 text-white text-[10px] sm:text-xs lg:text-sm">{formatDate(selectedOrder.created_at)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-400">Total Items:</span>
                    <span className="ml-1.5 sm:ml-2 text-white text-xs sm:text-sm">{getTotalItemsCount(selectedOrder)} item(s)</span>
                  </div>
                  <div className="pt-1.5 sm:pt-2 border-t border-white/10">
                    <span className="font-medium text-gray-400">Total Amount:</span>
                    <span className="ml-1.5 sm:ml-2 text-base sm:text-lg lg:text-xl font-bold text-green-400">{formatCurrency(selectedOrder.total_amount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-2 sm:mt-4 lg:mt-6">
              <h4 className="text-xs sm:text-sm lg:text-md font-semibold text-white mb-2 sm:mb-3">Order Items</h4>

              {/* Mobile Order Items */}
              <div className="lg:hidden space-y-2 sm:space-y-3">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/10">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <img src={item.image} alt={item.name} className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded bg-white/10" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-medium text-white flex items-center flex-wrap gap-1">
                          <span className="truncate">{item.name}</span>
                          {item.status === 'preorder' && (
                            <span className="px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-medium bg-blue-500/20 text-blue-400">
                              Preorder
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] sm:text-xs text-gray-400">{formatCurrency(item.price)} x {item.quantity}</span>
                          <span className="text-xs sm:text-sm font-bold text-white">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Order Items Table */}
              <div className="hidden lg:block bg-white/5 rounded-lg overflow-hidden border border-white/10">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Qty</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <img src={item.image} alt={item.name} className="h-10 w-10 object-contain rounded mr-3 bg-white/10" />
                            <div>
                              <div className="text-sm font-medium text-white flex items-center">
                                {item.name}
                                {item.status === 'preorder' && (
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                                    Preorder
                                  </span>
                                )}
                              </div>
                              {item.originalPrice && (
                                <div className="text-xs text-gray-500">
                                  Original: <span className="line-through">{formatCurrency(item.originalPrice)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-white">{formatCurrency(item.price)}</td>
                        <td className="px-4 py-3 text-sm text-white font-medium">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm font-medium text-white">{formatCurrency(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-2 sm:mt-4 lg:mt-6 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 text-white text-xs sm:text-sm rounded-lg hover:bg-white/20 transition-colors border border-white/10"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      <StatusChangeModal />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal />
    </div>
  );
}