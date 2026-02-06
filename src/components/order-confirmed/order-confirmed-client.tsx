'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, Phone, Package, MapPin, MessageCircle, Mail, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Phone,
    color: 'bg-brand-primary/10 text-brand-primary',
    title: 'Confirmation call',
    desc: 'We\u2019ll call you within 24 hours to confirm details.',
  },
  {
    icon: Package,
    color: 'bg-brand-primary/10 text-brand-primary',
    title: 'Preparing your order',
    desc: 'Your order will be packed within 1\u20132 business days.',
  },
  {
    icon: MapPin,
    color: 'bg-brand-primary/10 text-brand-primary',
    title: 'Free delivery',
    desc: 'Delivered to your door in 3\u20137 days. Pay cash on arrival.',
  },
];

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
    <div className="min-h-screen bg-gray-50 pt-6 pb-12" style={{ colorScheme: 'light' }}>
      <div className="max-w-lg mx-auto px-4 sm:px-6">
        {/* Main card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Success banner */}
          <div className="bg-gradient-to-br from-brand-dark to-brand-primary px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full mb-4 ring-4 ring-white/10">
              <Check className="w-7 h-7 text-white" strokeWidth={3} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mb-1">Order Confirmed</h1>
            <p className="text-white/60 text-sm">Thank you for choosing Warrior Leap</p>
          </div>

          {/* Order number */}
          <div className="px-6 py-5 border-b border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Order number</p>
            <p className="text-lg font-bold text-brand-dark font-mono tracking-wider">{orderNumber}</p>
            <p className="text-xs text-gray-400 mt-1">Save this for your records</p>
          </div>

          {/* Timeline */}
          <div className="px-6 py-5 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">What happens next</p>
            <div className="space-y-0">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex gap-3">
                    {/* Vertical line + dot */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-brand-primary" />
                      </div>
                      {i < steps.length - 1 && (
                        <div className="w-px h-full min-h-[24px] bg-gray-200 my-1" />
                      )}
                    </div>
                    {/* Content */}
                    <div className={i < steps.length - 1 ? 'pb-4' : ''}>
                      <p className="text-sm font-medium text-gray-900 leading-snug">{step.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Help */}
          <div className="px-6 py-5">
            <p className="text-xs text-gray-500 mb-3">Questions about your order?</p>
            <div className="flex gap-2">
              <a
                href={`https://wa.me/96171457820?text=${encodeURIComponent(`Hi, I have a question about order ${orderNumber}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors text-sm font-medium"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
              <a
                href="mailto:support@warriorleap.com"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
            </div>
          </div>
        </div>

        {/* Continue shopping */}
        <div className="text-center mt-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm text-brand-primary hover:text-brand-primary-dark transition-colors font-medium"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
