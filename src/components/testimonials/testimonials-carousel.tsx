'use client';

import { useRef } from 'react';
import { Testimonial } from '@/hooks/use-testimonials';
import { TestimonialCard } from './testimonial-card';

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = () => {
    if (trackRef.current) {
      trackRef.current.style.animationPlayState = 'paused';
    }
  };

  const handleTouchEnd = () => {
    if (trackRef.current) {
      trackRef.current.style.animationPlayState = 'running';
    }
  };

  return (
    <div className="relative">
      <style>
        {`
          .testimonials-wrapper {
            position: relative;
            width: 100%;
            overflow: hidden;
            mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          }

          .testimonials-track {
            display: flex;
            gap: 1rem;
            animation: scroll 60s linear infinite;
            width: max-content;
          }

          @media (hover: hover) {
            .testimonials-track:hover {
              animation-play-state: paused;
            }
          }

          @keyframes scroll {
            from { transform: translateX(0); }
            to { transform: translateX(calc(-50% - 0.5rem)); }
          }

          .testimonial-card {
            flex: 0 0 280px;
            min-height: 220px;
            height: 220px;
            background: white;
            border: 1px solid rgba(120, 113, 108, 0.15);
            border-radius: 0.75rem;
            padding: 1.25rem;
            position: relative;
            box-shadow: 0 1px 3px rgba(0,0,0,0.04);
            display: flex;
            flex-direction: column;
          }

          @media (min-width: 768px) {
            .testimonial-card {
              flex: 0 0 360px;
              min-height: 220px;
              height: 220px;
              padding: 1.5rem;
            }
          }

          @media (hover: hover) {
            .testimonial-card:hover {
              border-color: rgba(120, 113, 108, 0.25);
              box-shadow: 0 4px 12px rgba(0,0,0,0.06);
            }
          }
        `}
      </style>

      <div className="testimonials-wrapper">
        <div
          ref={trackRef}
          className="testimonials-track"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
          {testimonials.map((testimonial) => (
            <TestimonialCard key={`${testimonial.id}-dup`} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </div>
  );
}
