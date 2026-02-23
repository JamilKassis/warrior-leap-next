'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqData, FAQItem } from '@/data/faq-data';
import JsonLd from '@/components/json-ld';
import { generateFAQSchema } from '@/lib/schemas/faq-schema';

interface FAQProps {
  className?: string;
}

const FAQ: React.FC<FAQProps> = ({ className = '' }) => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]
    );
  };

  return (
    <>
      <JsonLd data={generateFAQSchema(faqData)} />
      <div className={`min-h-screen bg-white ${className}`}>
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Ice Bath & Cold Plunge FAQ</h1>
            <p className="text-sm text-gray-500 mt-1">Everything you need to know about ice baths, water chillers, and cold therapy in Lebanon</p>
          </div>
        </div>

      <section id="faq" className="py-10 md:py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">

          <div className="space-y-3">
            {faqData.map((item: FAQItem, index: number) => (
              <div
                key={index}
                className={`rounded-xl overflow-hidden border transition-all duration-200 ${
                  openItems.includes(index)
                    ? 'border-brand-primary/30 bg-gray-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <button
                  className="w-full text-left px-4 py-3.5 md:px-5 md:py-4 focus:outline-none flex justify-between items-center group"
                  onClick={() => toggleItem(index)}
                  aria-expanded={openItems.includes(index)}
                >
                  <span className="font-medium text-sm md:text-base text-gray-900">{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 group-hover:text-brand-primary flex-shrink-0 ml-3 transition-all duration-200 ${
                      openItems.includes(index) ? 'rotate-180 text-brand-primary' : ''
                    }`}
                  />
                </button>

                <div
                  className={`transition-all duration-200 overflow-hidden ${
                    openItems.includes(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-4 pb-3.5 md:px-5 md:pb-4 text-gray-600 text-xs md:text-sm leading-relaxed">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default FAQ;
