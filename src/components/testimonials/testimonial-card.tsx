'use client';

import { StarIcon } from '@heroicons/react/20/solid';
import { Testimonial } from '@/hooks/use-testimonials';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="testimonial-card flex flex-col h-full">
      <div className="flex items-center mb-3">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}`}
          />
        ))}
      </div>

      <p className="text-gray-700 text-xs md:text-sm leading-relaxed line-clamp-5 md:line-clamp-4 flex-1">
        &ldquo;{testimonial.comment}&rdquo;
      </p>

      <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
        <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center mr-3">
          <span className="text-white font-medium text-sm">
            {testimonial.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="font-medium text-brand-dark text-sm">{testimonial.name}</p>
          <p className="text-gray-500 text-xs">Verified</p>
        </div>
      </div>
    </div>
  );
}
