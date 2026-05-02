'use client';

import {
  Check,
  Phone,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Dumbbell,
  Hotel,
  Home,
  Layers,
  Truck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { RENT_PACKAGES, SERVICE_LEVELS } from '@/data/rent-packages';
import type { BookingPackageType, BookingServiceLevel } from '@/types/bookings';

const PHONE_DISPLAY = '+961 71 457 820';
const PHONE_TEL = 'tel:+96171457820';
const WHATSAPP_URL = 'https://wa.me/96171457820';

const PACKAGE_ICONS: Record<BookingPackageType, LucideIcon> = {
  event: Sparkles,
  gym: Dumbbell,
  retreat: Hotel,
  home: Home,
  corporate: Layers,
  content: Layers,
};

const TIER_ICONS: Record<BookingServiceLevel, LucideIcon> = {
  drop_off: Truck,
  attended: Users,
  coached: Users,
};

const RentOfferings = () => {
  return (
    <section
      id="offerings"
      className="relative py-14 md:py-20 lg:py-24 bg-gradient-to-b from-brand-dark via-[#0a1f25] to-brand-dark scroll-mt-24 overflow-hidden"
    >
      {/* ambient color */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 -left-20 w-[420px] h-[420px] bg-brand-primary/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[380px] h-[380px] bg-blue-900/15 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center mb-10 md:mb-12">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-brand-primary mb-3">
            What we rent
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
            Five categories.
            <span className="text-brand-primary"> Two service tiers.</span>
          </h2>
          <p className="text-white/60 text-sm md:text-base mt-4 max-w-xl mx-auto">
            Pick the closest fit, then call us. We’ll tailor the rest and send a personalized quote.
          </p>
        </div>

        {/* CATEGORIES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-14 md:mb-20">
          {RENT_PACKAGES.map(pkg => {
            const Icon = PACKAGE_ICONS[pkg.slug] ?? Layers;
            return (
              <article
                key={pkg.slug}
                className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 md:p-6 hover:border-brand-primary/50 hover:bg-white/[0.06] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-primary/15 border border-brand-primary/30 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-primary group-hover:border-brand-primary transition-colors">
                    <Icon className="w-5 h-5 text-brand-primary group-hover:text-white transition-colors" />
                  </div>
                  {pkg.highlight && (
                    <span className="text-[10px] uppercase tracking-[0.18em] text-brand-primary bg-brand-primary/10 border border-brand-primary/30 rounded-full px-2 py-0.5 self-start">
                      {pkg.highlight}
                    </span>
                  )}
                </div>

                <h3 className="text-lg md:text-xl font-display font-semibold text-white">
                  {pkg.title}
                </h3>
                <p className="text-sm text-brand-primary mt-1">{pkg.tagline}</p>
                <p className="text-sm text-white/65 mt-3 leading-relaxed">{pkg.description}</p>

                {/* hover accent line */}
                <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
              </article>
            );
          })}
        </div>

        {/* SERVICE TIERS */}
        <div className="text-center mb-8 md:mb-10">
          <h3 className="text-2xl md:text-3xl font-display font-bold text-white">
            Two ways we run it
          </h3>
          <p className="text-white/55 text-sm mt-2">
            Pick how much we do. You can upgrade either way at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-14 md:mb-20">
          {SERVICE_LEVELS.map(level => {
            const Icon = TIER_ICONS[level.slug] ?? Truck;
            return (
              <div
                key={level.slug}
                className={`relative rounded-2xl border p-6 md:p-7 transition-all hover:-translate-y-1 duration-300 ${
                  level.popular
                    ? 'border-brand-primary/60 bg-gradient-to-br from-brand-primary/[0.12] to-brand-primary/[0.02] shadow-xl shadow-brand-primary/10'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.05]'
                }`}
              >
                {level.popular && (
                  <span className="absolute -top-2.5 left-6 text-[10px] uppercase tracking-[0.18em] text-white bg-brand-primary rounded-full px-2.5 py-0.5 shadow-md">
                    Most popular
                  </span>
                )}

                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      level.popular
                        ? 'bg-brand-primary text-white'
                        : 'bg-brand-primary/15 text-brand-primary border border-brand-primary/30'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xl font-display font-semibold text-white leading-tight">
                      {level.title}
                    </h4>
                    <p className="text-sm text-brand-primary mt-0.5">{level.subtitle}</p>
                  </div>
                </div>

                <ul className="space-y-2">
                  {level.bullets.map(b => (
                    <li key={b} className="flex items-start gap-2 text-sm text-white/75">
                      <Check className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* CONTACT CTA */}
        <div
          id="contact"
          className="relative rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-md p-8 md:p-12 lg:p-14 overflow-hidden shadow-2xl shadow-black/30 scroll-mt-24"
        >
          <div className="absolute inset-0 opacity-50 pointer-events-none">
            <div className="absolute top-0 right-0 w-72 h-72 bg-brand-primary/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-900/20 rounded-full blur-3xl" />
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary text-white text-[11px] font-bold uppercase tracking-[0.22em] mb-4 shadow-lg shadow-brand-primary/30 ring-2 ring-brand-primary/30">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-75" />
                  <span className="relative w-2 h-2 rounded-full bg-white" />
                </span>
                Personalized quote
              </span>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white leading-tight">
                Call us. We’ll tailor it to you.
              </h3>
              <p className="mt-4 text-white/70 text-sm md:text-base leading-relaxed max-w-md">
                Every booking is different. Distance, dates, scale. Tell us what you need and we’ll send a clear quote.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={PHONE_TEL}
                className="group inline-flex items-center justify-between gap-3 px-6 py-4 rounded-2xl bg-brand-primary text-white font-medium hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/20"
              >
                <span className="inline-flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span className="flex flex-col items-start leading-tight">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/70">Call us</span>
                    <span className="text-base sm:text-lg font-mono">{PHONE_DISPLAY}</span>
                  </span>
                </span>
                <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#25D366] text-white font-medium hover:bg-[#1da851] transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>

              <p className="text-xs text-white/45 text-center mt-1">
                We reply within hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RentOfferings;
