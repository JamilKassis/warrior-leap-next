import type { Metadata } from 'next';
import RentPageClient from '@/components/rent/rent-page-client';
import JsonLd from '@/components/json-ld';
import { generateFAQSchema } from '@/lib/schemas/faq-schema';
import { RENT_FAQS } from '@/data/rent-packages';

export const metadata: Metadata = {
  title: 'Ice Bath Rental Lebanon | Mobile Cold Plunge Delivery & Setup | Warrior Leap',
  description:
    'Rent the ice bath experience anywhere in Lebanon. Mobile delivery, setup and trained attendants for home, corporate, gym, retreat and event packages across Beirut, Mount Lebanon and beyond.',
  keywords: [
    'ice bath rental lebanon',
    'mobile ice bath beirut',
    'cold plunge rental lebanon',
    'ice bath for events lebanon',
    'corporate ice bath lebanon',
    'ice bath delivery beirut',
    'ice bath birthday lebanon',
    'gym ice bath rental',
    'cold plunge experience lebanon',
    'rent ice bath beirut',
    'ice bath wellness day lebanon',
    'mobile cold plunge lebanon',
    'event ice bath lebanon',
    'retreat ice bath lebanon',
  ],
  openGraph: {
    title: 'Rent the Ice Bath Experience — Anywhere in Lebanon | Warrior Leap',
    description:
      'Mobile ice bath rental, delivered and set up across Lebanon. Home, corporate wellness, gym, retreat, event and content shoot packages.',
    type: 'website',
    url: 'https://warriorleap.com/rent',
  },
  alternates: {
    canonical: 'https://warriorleap.com/rent',
  },
};

const rentFaqItemsForSchema = RENT_FAQS.map(f => ({ question: f.q, answer: f.a }));

export default function RentPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <JsonLd data={generateFAQSchema(rentFaqItemsForSchema)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Ice Bath Rental & Mobile Cold Plunge Experience — Lebanon',
          serviceType: 'Mobile ice bath rental and event experience',
          provider: {
            '@type': 'LocalBusiness',
            name: 'Warrior Leap',
            telephone: '+961 71 457 820',
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'LB',
            },
          },
          areaServed: [
            { '@type': 'City', name: 'Beirut' },
            { '@type': 'AdministrativeArea', name: 'Mount Lebanon' },
            { '@type': 'AdministrativeArea', name: 'North Lebanon' },
            { '@type': 'AdministrativeArea', name: 'South Lebanon' },
            { '@type': 'AdministrativeArea', name: 'Bekaa' },
          ],
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
        }}
      />
      <RentPageClient />
    </div>
  );
}
