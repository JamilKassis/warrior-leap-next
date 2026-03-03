'use client';

import { FinanceManagement } from '@/adminpanel/components/finance-management';

export default function FinancePage() {
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in-up">
      <FinanceManagement />
    </div>
  );
}
