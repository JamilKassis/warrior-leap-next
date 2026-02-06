'use client';

import { useState } from 'react';
import { ShieldCheck, Award, Loader, ChevronDown } from 'lucide-react';
import { useWarranty } from '@/hooks/use-warranty';

export default function ProductWarranty() {
  const [isOpen, setIsOpen] = useState(false);
  const { warranty, loading, error } = useWarranty();

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 text-left group"
      >
        <span className="text-lg font-semibold text-brand-dark flex items-center">
          <ShieldCheck className="mr-2 h-5 w-5 text-brand-primary" />
          Warranty &amp; Support
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 group-hover:text-brand-primary transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          {loading ? (
            <div className="border border-brand-primary/20 rounded-xl px-6 py-8 flex items-center justify-center mb-4">
              <div className="flex items-center space-x-3">
                <Loader className="h-5 w-5 animate-spin text-brand-primary" />
                <span className="text-gray-600">Loading warranty information...</span>
              </div>
            </div>
          ) : error && !warranty ? (
            <div className="border border-brand-primary/20 rounded-xl px-6 py-8 mb-4">
              <div className="text-center text-gray-600">
                <p>Unable to load warranty information at this time.</p>
                <p className="text-sm mt-2">Please contact support for warranty details.</p>
              </div>
            </div>
          ) : (
            <div className="border border-brand-primary/20 rounded-xl overflow-hidden mb-4">
              {/* Coverage row */}
              <div className="flex items-start gap-4 px-4 py-4 bg-white transition-colors hover:bg-brand-primary/5">
                <div className="flex-shrink-0 bg-brand-primary/10 p-2 rounded-full">
                  <ShieldCheck className="h-5 w-5 text-brand-primary" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-medium text-gray-900">
                    {warranty?.name || '6-Month Full Coverage'}
                  </h4>
                  <p className="text-gray-600 mt-1 text-sm">
                    {warranty?.coverage_details ||
                      "Comprehensive warranty covering all parts and labor. If anything goes wrong, we'll fix it at no cost."}
                  </p>
                  {warranty?.duration_months && (
                    <span className="inline-block mt-2 px-2.5 py-1 bg-brand-primary/10 text-brand-primary text-xs font-medium rounded-full">
                      {warranty.duration_months} Month{warranty.duration_months > 1 ? 's' : ''} Coverage
                    </span>
                  )}
                </div>
              </div>

              {/* Promise row */}
              <div className="flex items-start gap-4 px-4 py-4 bg-gray-50 border-t border-brand-primary/20 transition-colors hover:bg-brand-primary/5">
                <div className="flex-shrink-0 bg-brand-primary/10 p-2 rounded-full">
                  <Award className="h-5 w-5 text-brand-primary" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-medium text-gray-900">Our Promise</h4>
                  <p className="text-gray-600 mt-1 text-sm">
                    {warranty?.description ||
                      'We stand behind the quality of our products with exceptional customer support.'}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gradient-to-r from-brand-light/40 to-brand-primary/10 px-4 py-3 border-t border-brand-primary/10">
                <p className="text-sm text-center text-brand-dark">
                  <span className="font-medium">Need help?</span> Contact our support team for warranty assistance.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
