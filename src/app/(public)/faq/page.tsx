import type { Metadata } from 'next';
import FAQ from '@/components/faq/faq';
import JsonLd from '@/components/json-ld';
import { generateBreadcrumbSchema } from '@/lib/schemas/breadcrumb-schema';

export const metadata: Metadata = {
  title: 'FAQ | Warrior Leap - Ice Bath & Cold Plunge Questions',
  description:
    'Frequently asked questions about ice baths, cold plunge therapy, maintenance, warranty, and delivery in Lebanon. Get answers from Warrior Leap.',
  openGraph: {
    title: 'FAQ | Warrior Leap - Ice Bath & Cold Plunge Questions',
    description:
      'Frequently asked questions about ice baths, cold plunge therapy, maintenance, warranty, and delivery in Lebanon.',
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
