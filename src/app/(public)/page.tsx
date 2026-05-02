import type { Metadata } from 'next';
import Hero from '@/components/home/hero/hero';
import RentExperienceSection from '@/components/home/rent-experience-section';
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
  title: 'Ice Bath Rental Lebanon | Mobile Cold Plunge Delivery & Setup | Warrior Leap',
  description:
    'Rent the ice bath experience anywhere in Lebanon. Mobile delivery, setup and trained attendants for home, corporate, gym, retreat and event packages — Beirut to the Bekaa. Premium ice baths also available to buy.',
  keywords: [
    'ice bath rental lebanon',
    'mobile ice bath beirut',
    'cold plunge rental lebanon',
    'ice bath for events lebanon',
    'corporate ice bath lebanon',
    'ice bath delivery beirut',
    'ice bath birthday lebanon',
    'gym ice bath rental',
    'rent ice bath beirut',
    'ice bath experience lebanon',
    'ice bath lebanon',
    'ice tub lebanon',
    'cold plunge lebanon',
    'water chiller lebanon',
    'cold therapy',
    'ice bath beirut',
    'cold water therapy',
    'recovery equipment',
  ],
  openGraph: {
    title: 'Ice Bath Rental Lebanon | Mobile Cold Plunge Experience | Warrior Leap',
    description:
      'Rent the ice bath experience anywhere in Lebanon. Mobile delivery, setup and trained attendants for home, corporate, gym, retreat and event packages.',
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
      <RentExperienceSection />
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
