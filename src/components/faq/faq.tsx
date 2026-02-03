'use client';

import { useState } from 'react';
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
      <section id="faq" className={`relative py-16 md:py-24 bg-brand-dark ${className}`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12">
            <div className="w-16 md:w-20 h-1 bg-white mb-4 mx-auto transform -skew-x-12" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqData.map((item: FAQItem, index: number) => (
              <div
                key={index}
                className={`bg-white/5 rounded-lg overflow-hidden border-l-4 ${
                  openItems.includes(index) ? 'border-l-brand-primary bg-white/10' : 'border-l-transparent'
                } transition-all duration-200`}
              >
                <button
                  className="w-full text-left px-5 py-4 focus:outline-none flex justify-between items-center"
                  onClick={() => toggleItem(index)}
                  aria-expanded={openItems.includes(index)}
                >
                  <span className="font-medium text-sm md:text-base text-white">{item.question}</span>
                  <svg
                    className={`w-5 h-5 text-brand-primary flex-shrink-0 ml-3 transition-transform duration-200 ${
                      openItems.includes(index) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  className={`transition-all duration-200 overflow-hidden ${
                    openItems.includes(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-5 pb-4 text-white/70 text-sm leading-relaxed">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQ;
