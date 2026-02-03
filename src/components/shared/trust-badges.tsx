'use client';

import { useTrustIndicators } from '@/hooks/use-trust-indicators';

export function TrustBadges() {
  const { trustIndicators, loading, error } = useTrustIndicators();

  if (loading) {
    return (
      <div className="bg-brand-dark/95 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 md:divide-x divide-white/10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-center py-3 md:py-5 px-1 md:px-2 animate-pulse">
                <div className="text-center">
                  <div className="h-3 md:h-5 w-10 md:w-20 bg-white/20 rounded mb-1 mx-auto" />
                  <div className="h-2 md:h-3 w-8 md:w-16 bg-white/10 rounded mx-auto" />
                </div>
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
    <div className="bg-brand-dark/95 border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-4 md:divide-x divide-white/10">
          {trustIndicators.map((indicator) => (
            <div
              key={indicator.id}
              className="flex items-center justify-center py-3 md:py-5 px-1 md:px-2 group hover:bg-white/5 transition-colors duration-300"
            >
              <div className="text-center">
                <p className="text-white font-semibold text-sm md:text-lg leading-none">{indicator.title}</p>
                <p className="text-white/50 text-[10px] md:text-xs leading-tight mt-1">{indicator.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
