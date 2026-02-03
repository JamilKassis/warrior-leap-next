'use client';

import { OrdersManagement } from '@/adminpanel/components/orders-management';

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in-up">
      <OrdersManagement />
    </div>
  );
}
