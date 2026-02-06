'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
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
        className="relative py-10 md:py-16 lg:py-24 overflow-hidden"
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
              className="inline-flex items-center gap-2 px-6 py-2.5 md:px-8 md:py-3 border-2 border-brand-dark text-brand-dark font-display font-medium text-xs md:text-sm rounded-lg hover:bg-brand-dark hover:text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Share Your Experience
            </button>
          </div>
        </div>
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white sm:rounded-2xl rounded-t-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
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
