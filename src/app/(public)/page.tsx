import type { Metadata } from 'next';
import Hero from '@/components/home/hero/hero';
import ProductsSection from '@/components/home/products/products-section';
import Benefits from '@/components/home/benefits/benefits';
import { Testimonials } from '@/components/testimonials/testimonials';
import { TrustBadges } from '@/components/shared/trust-badges';
import { HomeFAQ } from '@/components/home/faq/home-faq';
import { FinalCTA } from '@/components/home/cta/final-cta';

export const metadata: Metadata = {
  title: 'Ice Baths & Cold Plunge Systems in Lebanon',
  description:
    'Ice bath tubs, chillers, and complete cold plunge systems. Free delivery and installation anywhere in Lebanon. Start your cold therapy recovery today.',
  openGraph: {
    title: 'Ice Baths & Cold Plunge Systems in Lebanon | Warrior Leap',
    description:
      'Ice bath tubs, chillers, and complete cold plunge systems. Free delivery and installation anywhere in Lebanon.',
    type: 'website',
    url: 'https://warriorleap.com/',
  },
  alternates: {
    canonical: 'https://warriorleap.com/',
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <TrustBadges />
      <div className="flex flex-col">
        <ProductsSection />
        <Benefits />
        <Testimonials />
        <HomeFAQ />
        <FinalCTA />
      </div>
    </div>
  );
}
