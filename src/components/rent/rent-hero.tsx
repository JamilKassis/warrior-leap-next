'use client';

import { ChevronDown } from 'lucide-react';

const RentHero = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative w-full min-h-[88vh] flex items-center overflow-hidden">
      {/* Background — same image set as homepage hero, ambient single image */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-[#0a2530] to-[#132730]" />
        <picture>
          <source srcSet="/assets/images/Girl chilling in ice tub-mobile.webp" media="(max-width: 767px)" type="image/webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/images/Girl chilling in ice tub.webp"
            alt="Ice bath rental experience in Lebanon, delivered, set up, and run anywhere"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            style={{ filter: 'contrast(1.15) brightness(0.7) saturate(1.05)', objectPosition: 'center 70%' }}
            loading="eager"
            decoding="async"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-transparent" />
        <div className="absolute -top-1/3 left-1/2 w-full h-full rotate-12 bg-gradient-to-b from-brand-primary/15 via-transparent to-transparent opacity-50 transform -translate-x-1/2" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-28 pb-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-display font-bold tracking-tight leading-[1.05] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            Rent the Ice Bath Experience.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/85 max-w-2xl leading-relaxed">
            We deliver, set up, and run it. You just need water.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => scrollTo('contact')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-brand-primary text-white font-medium hover:bg-brand-primary/85 transition-colors"
            >
              Request a quote
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/30 text-white font-medium backdrop-blur-sm bg-white/5 hover:bg-white/10 hover:border-white/50 transition-all"
            >
              How it works
            </button>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" /> All you need is water
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" /> Trained attendants
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" /> Quote in hours
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => scrollTo('how-it-works')}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 group flex flex-col items-center text-white/80 hover:text-white transition-colors"
        aria-label="Scroll to how it works"
      >
        <span className="text-xs uppercase tracking-[0.2em] mb-1">Scroll</span>
        <ChevronDown size={20} className="animate-bounce" />
      </button>
    </section>
  );
};

export default RentHero;
