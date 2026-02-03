'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/cart-context';
import { useOrders } from '@/hooks/use-orders';
import { CheckoutFormData } from '@/types/cart';
import { CreateOrderData } from '@/types/orders';
import { ArrowLeft, Package, User, Check, X } from 'lucide-react';

export default function CheckoutClient() {
  const { items, getTotalPrice, clearCart } = useCart();
  const { createOrder } = useOrders();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CheckoutFormData>({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'Name is required';
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const orderData: CreateOrderData = {
        customer_name: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        notes: formData.notes,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          originalPrice: item.originalPrice,
          quantity: item.quantity,
          image: item.image,
          description: item.description,
          urlFriendlyName: item.urlFriendlyName,
          status: item.status,
        })),
        subtotal: getTotalPrice(),
        total_amount: getTotalPrice(),
        payment_method: 'cash_on_delivery',
        initial_order_status: 'pending',
      };

      const newOrder = await createOrder(orderData);
      if (newOrder) {
        clearCart();
        router.push(`/order-confirmed?orderNumber=${newOrder.order_number}`);
      } else {
        throw new Error('Failed to create order');
      }
    } catch (err) {
      let errorMessage = 'Failed to submit order. Please try again.';
      if (err instanceof Error) {
        if (err.message.includes('fetch failed') || err.message.includes('network')) {
          errorMessage = 'Network connection error. Please check your internet connection.';
        } else if (err.message) {
          errorMessage = `Order submission failed: ${err.message}`;
        }
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => price.toLocaleString();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-gray-200 p-10 max-w-md w-full mx-4">
          <div className="text-center">
            <Package className="w-14 h-14 text-gray-300 mx-auto mb-5" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 text-sm mb-6">Add some products before proceeding to checkout</p>
            <button
              onClick={() => router.push('/')}
              className="bg-brand-primary text-white px-5 py-2.5 rounded-lg hover:bg-brand-primary/90 transition-colors flex items-center mx-auto text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 border border-gray-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Error</h3>
            <p className="text-gray-600 text-sm mb-6">{error}</p>
            <button
              onClick={() => setError(null)}
              className="w-full bg-brand-primary text-white py-2.5 px-6 rounded-lg font-medium hover:bg-brand-primary/90 transition-colors text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 pt-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-brand-dark mb-2">Checkout</h1>
            <p className="text-sm text-gray-600">
              Fill in your delivery details below. Pay cash when your order arrives.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
            <h2 className="text-base font-semibold text-brand-dark mb-4 flex items-center">
              <User className="w-4 h-4 text-brand-primary mr-2" />
              Delivery Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    autoComplete="name"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-primary text-sm ${
                      errors.customerName ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.customerName && <p className="text-red-600 text-xs mt-1">{errors.customerName}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1.5">
                    Email <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    autoComplete="email"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-primary text-sm ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    autoComplete="tel"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-primary text-sm ${
                      errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="+961..."
                  />
                  {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label htmlFor="city" className="block text-xs font-medium text-gray-700 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    autoComplete="address-level2"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-primary text-sm ${
                      errors.city ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="Beirut, Tripoli..."
                  />
                  {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-xs font-medium text-gray-700 mb-1.5">
                  Address *
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  autoComplete="street-address"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-primary text-sm ${
                    errors.address ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                  placeholder="Street, building, floor..."
                />
                {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Notes <span className="text-gray-400">(Optional)</span>
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-primary text-sm bg-white resize-none"
                  placeholder="Delivery instructions..."
                />
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-xs font-medium text-gray-700 mb-3">Order Summary</h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-contain rounded bg-gray-50 border border-gray-200 p-1"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} x ${formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ${formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="text-lg font-bold text-brand-primary">${formatPrice(getTotalPrice())}</span>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-xs text-gray-500 text-center mb-4">
                  Cash on delivery - We&apos;ll call to confirm - 3-7 day delivery
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-primary text-white py-3 rounded-lg font-medium hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Complete Order
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
