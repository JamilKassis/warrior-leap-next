import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="relative py-14 md:py-20 lg:py-24 bg-brand-dark overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-brand-light rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-12 md:w-16 lg:w-20 h-1 bg-brand-primary mb-4 md:mb-5 mx-auto transform -skew-x-12" />
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">
          Get Your Ice Bath Delivered in Lebanon
        </h2>
        <p className="text-white/70 text-sm md:text-base max-w-xl mx-auto mb-8 md:mb-10">
          Premium ice baths, water chillers, and cold plunge systems with free delivery and professional installation anywhere in Lebanon. Start your cold therapy journey today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 md:px-8 md:py-3 bg-white text-brand-dark font-display font-medium text-xs md:text-sm rounded-lg hover:bg-white/90 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Shop Products
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://wa.me/96171457820"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 md:px-8 md:py-3 border border-white/30 text-white font-display font-medium text-xs md:text-sm rounded-lg hover:bg-white/10 hover:border-white/50 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4" />
            Chat With Us
          </a>
        </div>
      </div>
    </section>
  );
}
