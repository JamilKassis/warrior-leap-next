'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Check,
  Package,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Clock,
  ArrowLeft,
  MessageCircle,
} from 'lucide-react';

export default function OrderConfirmedClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');

  useEffect(() => {
    if (!orderNumber) router.push('/');
  }, [orderNumber, router]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!orderNumber) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-brand-light rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-brand-dark rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 py-8 pt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-3">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mr-3">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-brand-dark">Order Confirmed!</h1>
            </div>
            <p className="text-sm text-brand-dark/70 max-w-xl mx-auto">
              Thank you for your order. We&apos;ll start processing it right away and keep you updated.
            </p>
          </div>

          {/* Order Number */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-brand-primary/20 p-6 mb-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-primary/10 rounded-lg mb-4">
                <Package className="w-6 h-6 text-brand-primary" />
              </div>
              <h2 className="text-lg font-bold text-brand-dark mb-3">Your Order Details</h2>
              <div className="bg-gradient-to-r from-brand-primary/10 to-brand-light/20 rounded-lg p-4 mb-4">
                <p className="text-xs font-medium text-brand-dark/70 mb-1">Order Number</p>
                <p className="text-xl font-bold text-brand-primary font-mono tracking-wider">{orderNumber}</p>
                <p className="text-xs text-brand-dark/60 mt-2">Please save this number for your records</p>
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-brand-primary/20 p-6 mb-6">
            <h3 className="text-lg font-bold text-brand-dark mb-4 text-center">What Happens Next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-sm font-semibold text-brand-dark mb-2">1. We&apos;ll Contact You</h4>
                <p className="text-xs text-brand-dark/70">
                  Our team will call or email you within 24 hours to confirm your order details.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-3">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="text-sm font-semibold text-brand-dark mb-2">2. Order Processing</h4>
                <p className="text-xs text-brand-dark/70">
                  We&apos;ll prepare your order for delivery. This typically takes 1-2 business days.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-3">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="text-sm font-semibold text-brand-dark mb-2">3. Fast Delivery</h4>
                <p className="text-xs text-brand-dark/70">
                  Delivered to your address within 3-7 business days. Pay cash on delivery.
                </p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-yellow-200 p-6 mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-brand-dark mb-3 text-center">Payment Information</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-4 h-4 text-yellow-600 mr-2" />
                <span className="font-semibold text-yellow-800 text-sm">Cash on Delivery</span>
              </div>
              <p className="text-yellow-700 mb-2 text-sm">
                <strong>No payment required now!</strong>
              </p>
              <p className="text-xs text-yellow-600">
                You&apos;ll pay the full amount when your order is delivered.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-brand-primary/20 p-6 mb-6">
            <h3 className="text-lg font-bold text-brand-dark mb-4 text-center">Need Help?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-brand-primary/10 rounded-lg mb-3">
                  <Phone className="w-5 h-5 text-brand-primary" />
                </div>
                <h4 className="text-sm font-semibold text-brand-dark mb-2">Call Us</h4>
                <a
                  href="tel:+961-70-123-456"
                  className="inline-flex items-center px-3 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors text-sm"
                >
                  <Phone className="w-3 h-3 mr-2" />
                  +961 70 123 456
                </a>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-brand-primary/10 rounded-lg mb-3">
                  <Mail className="w-5 h-5 text-brand-primary" />
                </div>
                <h4 className="text-sm font-semibold text-brand-dark mb-2">Email Us</h4>
                <a
                  href="mailto:support@warriorleap.com"
                  className="inline-flex items-center px-3 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors text-sm"
                >
                  <Mail className="w-3 h-3 mr-2" />
                  Contact Support
                </a>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-brand-primary/10 rounded-lg mb-3">
                  <MessageCircle className="w-5 h-5 text-brand-primary" />
                </div>
                <h4 className="text-sm font-semibold text-brand-dark mb-2">WhatsApp</h4>
                <a
                  href="https://wa.me/96170123456?text=Hi,%20I%20have%20a%20question%20about%20my%20order"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors text-sm"
                >
                  <MessageCircle className="w-3 h-3 mr-2" />
                  Chat with us
                </a>
              </div>
            </div>
          </div>

          {/* Back */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center text-brand-primary hover:text-brand-dark transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
