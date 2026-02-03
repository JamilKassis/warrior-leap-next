'use client';

import { useState } from 'react';
import { useTestimonials } from '@/hooks/use-testimonials';
import { TestimonialsHeader } from './testimonials-header';
import { TestimonialsCarousel } from './testimonials-carousel';
import { TestimonialForm } from './testimonial-form';

export function Testimonials() {
  const { testimonials, loading, error, addTestimonial } = useTestimonials();
  const [showForm, setShowForm] = useState(false);

  if (loading)
    return (
      <div className="text-center py-12 bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto" />
        <p className="text-gray-600 mt-4">Loading testimonials...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-12 bg-white">
        <div className="text-red-500">Error loading testimonials: {error.message}</div>
      </div>
    );

  return (
    <>
      <section
        className="relative py-16 md:py-24 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 50%, #ffffff 100%)' }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TestimonialsHeader />
          <div className="mt-10 md:mt-12">
            <TestimonialsCarousel testimonials={testimonials} />
          </div>

          <div className="text-center mt-12 md:mt-14">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-6 py-2.5 md:px-8 md:py-3 bg-brand-primary text-white font-display font-medium text-xs md:text-sm rounded-lg hover:bg-brand-primary/90 transition-colors"
            >
              Share Your Experience
            </button>
          </div>
        </div>
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <TestimonialForm
              onSubmit={async (data) => {
                const result = await addTestimonial(data);
                if (!result?.isRateLimited) {
                  setTimeout(() => setShowForm(false), 2000);
                }
                return result;
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
