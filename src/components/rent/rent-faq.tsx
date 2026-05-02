'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { RENT_FAQS } from '@/data/rent-packages';

const RentFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-10 md:py-16 lg:py-24 bg-[#f5f7f7]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-10 lg:mb-12">
          <div className="w-12 md:w-16 lg:w-20 h-1 bg-brand-primary mb-3 md:mb-4 mx-auto transform -skew-x-12" />
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-brand-dark">
            Common questions
          </h2>
          <p className="text-gray-500 text-xs md:text-sm mt-2">
            Everything you need to know before requesting a quote
          </p>
        </div>

        <div className="space-y-3">
          {RENT_FAQS.map((faq, index) => {
            const open = openIndex === index;
            return (
              <div
                key={faq.q}
                className={`rounded-xl overflow-hidden border transition-all duration-200 ${
                  open
                    ? 'border-brand-primary/30 bg-white shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <button
                  type="button"
                  className="w-full text-left px-4 py-3.5 md:px-5 md:py-4 focus:outline-none flex justify-between items-center group"
                  onClick={() => setOpenIndex(open ? null : index)}
                  aria-expanded={open}
                >
                  <span className="font-medium text-sm md:text-base text-gray-900">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 group-hover:text-brand-primary flex-shrink-0 ml-3 transition-all duration-200 ${
                      open ? 'rotate-180 text-brand-primary' : ''
                    }`}
                  />
                </button>

                <div
                  className={`transition-all duration-200 overflow-hidden ${
                    open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-4 pb-3.5 md:px-5 md:pb-4 text-gray-600 text-xs md:text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RentFAQ;
