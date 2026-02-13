import type { Metadata } from 'next';
import Hero from '@/components/home/hero/hero';
import ProductsSection from '@/components/home/products/products-section';
import Benefits from '@/components/home/benefits/benefits';
import { Testimonials } from '@/components/testimonials/testimonials';
import { TrustBadges } from '@/components/shared/trust-badges';
import { HomeFAQ } from '@/components/home/faq/home-faq';
import { FinalCTA } from '@/components/home/cta/final-cta';

export const metadata: Metadata = {
  title: 'Ice Bath Lebanon | Ice Tub & Cold Plunge Systems',
  description:
    'Buy ice bath and ice tub in Lebanon. Premium cold plunge systems and chillers for recovery and wellness. Best ice bath Lebanon prices. Free delivery and installation across Lebanon.',
  openGraph: {
    title: 'Ice Bath Lebanon | Ice Tub & Cold Plunge Systems | Warrior Leap',
    description:
      'Buy ice bath and ice tub in Lebanon. Premium cold plunge systems and chillers. Free delivery and installation across Lebanon.',
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
