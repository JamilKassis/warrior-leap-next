import type { Metadata } from 'next';
import FAQ from '@/components/faq/faq';
import JsonLd from '@/components/json-ld';
import { generateBreadcrumbSchema } from '@/lib/schemas/breadcrumb-schema';

export const metadata: Metadata = {
  title: 'Ice Bath FAQ Lebanon | Cold Plunge & Chiller Questions',
  description:
    'Frequently asked questions about ice baths in Lebanon. Learn about ice bath prices, delivery, water chillers, cold plunge benefits, maintenance, and warranty. Answers from Warrior Leap.',
  keywords: [
    'ice bath faq',
    'ice bath questions',
    'ice bath lebanon',
    'cold plunge faq',
    'water chiller questions',
    'ice bath price lebanon',
    'ice bath delivery lebanon',
  ],
  openGraph: {
    title: 'Ice Bath FAQ Lebanon | Warrior Leap',
    description:
      'Frequently asked questions about ice baths, water chillers, and cold plunge systems in Lebanon.',
    type: 'website',
    url: 'https://warriorleap.com/faq',
  },
  alternates: {
    canonical: 'https://warriorleap.com/faq',
  },
};

export default function FAQPage() {
  const breadcrumbs = [
    { name: 'Home', url: 'https://warriorleap.com' },
    { name: 'FAQ', url: 'https://warriorleap.com/faq' },
  ];

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      <FAQ />
    </>
  );
}
