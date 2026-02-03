'use client';

import { useState, useEffect } from 'react';
import { TrustIndicatorsManagement } from '@/adminpanel/components/trust-indicators-management';
import { TestimonialsManagement } from '@/adminpanel/components/testimonials-management';
import { useOrders } from '@/hooks/use-orders';
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ClockIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalOrders: number;
  confirmedOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  totalRevenue: number;
  todayOrders: number;
  urgentOrders: number;
}

export default function AdminDashboard() {
  const { getOrderStats } = useOrders();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const orderStats = await getOrderStats();
      setStats(orderStats);
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

  const statCards = [
    { label: 'Revenue', value: formatCurrency(stats?.totalRevenue || 0), sub: 'From paid orders', icon: CurrencyDollarIcon, color: 'green' },
    { label: 'Orders', value: stats?.totalOrders || 0, sub: `${stats?.todayOrders || 0} today`, icon: ShoppingCartIcon, color: 'blue' },
    { label: 'Pending', value: stats?.pendingOrders || 0, sub: `${stats?.processingOrders || 0} processing`, icon: ClockIcon, color: 'yellow' },
    { label: 'Confirmed', value: stats?.confirmedOrders || 0, sub: `${stats?.shippedOrders || 0} shipped`, icon: UsersIcon, color: 'purple' },
  ];

  return (
    <div className="space-y-3 sm:space-y-6 lg:space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-6 lg:mb-8">
        <div>
          <h1 className="text-lg sm:text-2xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-brand-light">
            Dashboard
          </h1>
          <p className="mt-0.5 sm:mt-2 text-xs sm:text-sm text-gray-400">Welcome back, Admin</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 mb-3 sm:mb-6 lg:mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="p-2.5 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl lg:rounded-2xl bg-brand-dark/30 border border-white/10 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider">{card.label}</h3>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-${card.color}-500/20 flex items-center justify-center`}>
                <card.icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${card.color}-400`} />
              </div>
            </div>
            {loading ? (
              <div className="h-8 sm:h-10 bg-white/10 rounded animate-pulse" />
            ) : (
              <>
                <p className="text-base sm:text-xl lg:text-3xl font-bold text-white mt-0.5 sm:mt-1">{card.value}</p>
                <div className={`mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-${card.color}-400`}>{card.sub}</div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 sm:gap-4 lg:gap-8">
        <div className="p-2 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl lg:rounded-2xl bg-brand-dark/30 border border-white/10 backdrop-blur-sm shadow-xl">
          <h2 className="text-sm sm:text-base lg:text-xl font-bold text-white mb-2 sm:mb-4 lg:mb-6 flex items-center">
            <span className="w-1 sm:w-1.5 lg:w-2 h-4 sm:h-6 lg:h-8 bg-brand-primary rounded-full mr-1.5 sm:mr-2 lg:mr-3" />
            Trust Indicators
          </h2>
          <TrustIndicatorsManagement />
        </div>
        <div className="p-2 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl lg:rounded-2xl bg-brand-dark/30 border border-white/10 backdrop-blur-sm shadow-xl">
          <h2 className="text-sm sm:text-base lg:text-xl font-bold text-white mb-2 sm:mb-4 lg:mb-6 flex items-center">
            <span className="w-1 sm:w-1.5 lg:w-2 h-4 sm:h-6 lg:h-8 bg-purple-500 rounded-full mr-1.5 sm:mr-2 lg:mr-3" />
            Recent Testimonials
          </h2>
          <TestimonialsManagement />
        </div>
      </div>
    </div>
  );
}
