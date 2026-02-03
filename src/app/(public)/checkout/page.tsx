import type { Metadata } from 'next';
import CheckoutClient from '@/components/checkout/checkout-client';

export const metadata: Metadata = {
  title: 'Checkout | Warrior Leap',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
