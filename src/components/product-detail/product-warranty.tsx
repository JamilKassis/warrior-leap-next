'use client';

import { ShieldCheck, Award, Loader } from 'lucide-react';
import { useWarranty } from '@/hooks/use-warranty';

export default function ProductWarranty() {
  const { warranty, loading, error } = useWarranty();

  const headerBar = (
    <div className="bg-gradient-to-r from-brand-primary to-brand-dark px-6 py-4">
      <h3 className="text-lg font-semibold text-white flex items-center">
        <ShieldCheck className="mr-2 h-5 w-5" />
        Warranty &amp; Support
      </h3>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {headerBar}
        <div className="px-6 py-8 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <Loader className="h-5 w-5 animate-spin text-brand-primary" />
            <span className="text-gray-600">Loading warranty information...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !warranty) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {headerBar}
        <div className="px-6 py-8">
          <div className="text-center text-gray-600">
            <p>Unable to load warranty information at this time.</p>
            <p className="text-sm mt-2">Please contact support for warranty details.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {headerBar}
      <div className="px-6 py-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-brand-primary/10 p-2 rounded-full mr-4">
              <ShieldCheck className="h-5 w-5 text-brand-primary" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{warranty?.name || '6-Month Full Coverage'}</h4>
              <p className="text-gray-600 mt-1">
                {warranty?.coverage_details ||
                  "Comprehensive warranty covering all parts and labor. If anything goes wrong, we'll fix it at no cost."}
              </p>
              {warranty?.duration_months && (
                <span className="inline-block mt-2 px-2 py-1 bg-brand-primary/10 text-brand-primary text-xs font-medium rounded-full">
                  {warranty.duration_months} Month{warranty.duration_months > 1 ? 's' : ''} Coverage
                </span>
              )}
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 bg-brand-primary/10 p-2 rounded-full mr-4">
              <Award className="h-5 w-5 text-brand-primary" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Our Promise</h4>
              <p className="text-gray-600 mt-1">
                {warranty?.description ||
                  'We stand behind the quality of our products with exceptional customer support.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-brand-primary/5 px-6 py-3 border-t border-gray-100">
        <p className="text-sm text-center text-brand-dark">
          <span className="font-medium">Need help?</span> Contact our support team for warranty assistance.
        </p>
      </div>
    </div>
  );
}
