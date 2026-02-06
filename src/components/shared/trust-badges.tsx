'use client';

import { Truck, ShieldCheck, Award, Headphones } from 'lucide-react';
import { useTrustIndicators } from '@/hooks/use-trust-indicators';

const fallbackIcons = [Truck, ShieldCheck, Award, Headphones];

export function TrustBadges() {
  const { trustIndicators, loading, error } = useTrustIndicators();

  if (loading) {
    return (
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-evenly py-4 md:py-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center animate-pulse">
                <div className="w-5 h-5 bg-gray-200 rounded-full mb-1.5" />
                <div className="h-3 w-14 bg-gray-200 rounded" />
                <div className="h-2 w-10 bg-gray-100 rounded mt-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || trustIndicators.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-evenly py-4 md:py-5">
          {trustIndicators.map((indicator, index) => {
            const Icon = fallbackIcons[index % fallbackIcons.length];
            return (
              <div
                key={indicator.id}
                className="flex flex-col items-center text-center"
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5 text-brand-primary mb-1" />
                <p className="text-brand-dark font-semibold text-[10px] sm:text-xs md:text-sm leading-tight">{indicator.title}</p>
                <p className="text-gray-400 text-[9px] sm:text-[10px] md:text-xs leading-tight mt-0.5 hidden sm:block">{indicator.subtitle}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
