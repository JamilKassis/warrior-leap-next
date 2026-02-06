import type { Metadata } from 'next';
import FAQ from '@/components/faq/faq';
import JsonLd from '@/components/json-ld';
import { generateBreadcrumbSchema } from '@/lib/schemas/breadcrumb-schema';

export const metadata: Metadata = {
  title: 'Ice Bath & Cold Plunge FAQ',
  description:
    'Common questions about our ice baths, chillers, delivery, warranty, and cold therapy in general. If you need help, we are here.',
  openGraph: {
    title: 'Ice Bath & Cold Plunge FAQ | Warrior Leap',
    description:
      'Common questions about our ice baths, chillers, delivery, warranty, and cold therapy.',
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
