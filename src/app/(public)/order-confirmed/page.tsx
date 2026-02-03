import type { Metadata } from 'next';
import OrderConfirmedClient from '@/components/order-confirmed/order-confirmed-client';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Order Confirmed | Warrior Leap',
  robots: { index: false, follow: false },
};

export default function OrderConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary" />
        </div>
      }
    >
      <OrderConfirmedClient />
    </Suspense>
  );
}
