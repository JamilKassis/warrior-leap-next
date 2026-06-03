import type { Metadata } from 'next';
import Hero from '@/components/home/hero/hero';
import ProductsSection from '@/components/home/products/products-section';
import Benefits from '@/components/home/benefits/benefits';
import { Testimonials } from '@/components/testimonials/testimonials';
import { TrustBadges } from '@/components/shared/trust-badges';
import { HomeFAQ } from '@/components/home/faq/home-faq';
import { FinalCTA } from '@/components/home/cta/final-cta';
import { SEOIntro } from '@/components/home/seo-intro';
import JsonLd from '@/components/json-ld';
import { generateFAQSchema } from '@/lib/schemas/faq-schema';
import { faqData } from '@/data/faq-data';
import { generateWebSiteSchema } from '@/lib/schemas/website-schema';

export const metadata: Metadata = {
  title: 'Ice Bath Lebanon | Ice Tub & Cold Plunge Systems | Buy Online',
  description:
    'Buy ice bath and ice tub in Lebanon. Premium cold plunge systems, water chillers, and recovery equipment. Best ice bath Lebanon prices. Free delivery and installation in Beirut and all Lebanon.',
  keywords: [
    'ice bath lebanon',
    'ice tub lebanon',
    'cold plunge lebanon',
    'ice bath',
    'ice tub',
    'cold plunge',
    'water chiller lebanon',
    'chiller',
    'cold therapy',
    'buy ice bath lebanon',
    'ice bath beirut',
    'ice bath delivery lebanon',
    'portable ice bath',
    'cold water therapy',
    'recovery equipment',
    'ice bath price lebanon',
  ],
  openGraph: {
    title: 'Ice Bath Lebanon | #1 Ice Tub & Cold Plunge Shop | Warrior Leap',
    description:
      'Buy ice bath and ice tub in Lebanon. Premium cold plunge systems, water chillers, and recovery equipment. Free delivery and installation across Lebanon.',
    type: 'website',
    url: 'https://warriorleap.com/',
  },
  alternates: {
    canonical: 'https://warriorleap.com/',
  },
};

const homeFaqItems = [7, 10, 5, 8, 0].map((i) => faqData[i]);

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <JsonLd data={generateFAQSchema(homeFaqItems)} />
      <JsonLd data={generateWebSiteSchema()} />
      <Hero />
      <TrustBadges />
      <SEOIntro />
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
