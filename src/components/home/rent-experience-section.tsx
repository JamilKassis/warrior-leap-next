import Link from 'next/link';
import { TruckIcon, ClockIcon, SparklesIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const HIGHLIGHTS = [
  { icon: TruckIcon, label: 'All you need is water', body: 'We bring the bath and handle the cooling. Ice or chiller, your choice.' },
  { icon: ClockIcon, label: 'Quote in hours', body: 'Tell us your needs. We’ll call and send a quote fast.' },
  { icon: UserGroupIcon, label: 'Made for any occasion', body: 'Events, gyms, hotels, personal & custom.' },
  { icon: SparklesIcon, label: 'Two service tiers', body: 'Drop-off or attended, your call.' },
];

const RentExperienceSection = () => {
  return (
    <section
      id="rent-experience"
      className="relative py-20 sm:py-28 bg-gradient-to-b from-brand-dark via-[#0a1f25] to-brand-dark overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-primary/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-900/15 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary text-white text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] mb-5 shadow-lg shadow-brand-primary/40 ring-2 ring-brand-primary/30">
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-75" />
                <span className="relative w-2 h-2 rounded-full bg-white" />
              </span>
              Rental service
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-[1.05]">
              The ice bath experience,
              <span className="block text-brand-primary">delivered to you.</span>
            </h2>
            <p className="mt-6 text-lg text-white/75 leading-relaxed max-w-2xl">
              We bring it. We set it up. You just need water.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 max-w-xl">
              {HIGHLIGHTS.map(h => (
                <div key={h.label} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/15 flex items-center justify-center flex-shrink-0">
                    <h.icon className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{h.label}</div>
                    <div className="text-xs text-white/55 leading-snug">{h.body}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/rent"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-brand-primary text-white font-medium hover:bg-brand-primary/85 transition-colors"
              >
                Explore packages & book
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/rent#quote-form"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 hover:border-white/40 transition-all"
              >
                See all categories
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
              <picture>
                <source srcSet="/assets/images/Girl Entering Ice Tub-mobile.webp" media="(max-width: 767px)" type="image/webp" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/images/Girl Entering Ice Tub.webp"
                  alt="Mobile ice bath rental, delivered and set up at your location"
                  className="w-full h-full object-cover"
                  style={{ filter: 'contrast(1.1) brightness(0.85) saturate(1.05)' }}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wider text-brand-primary/90">Built around you</div>
                  <div className="text-2xl font-display font-bold text-white">Flexible scheduling</div>
                </div>
                <Link
                  href="/rent"
                  className="px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur text-white text-sm font-medium hover:bg-white/20 transition-colors"
                >
                  Get a quote →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RentExperienceSection;
