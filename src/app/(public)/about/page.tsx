import type { Metadata } from 'next';
import Link from 'next/link';
import { Users, Target, Award, ArrowRight, Truck, ShieldCheck, Headphones } from 'lucide-react';
import content from '@/data/about.json';
import JsonLd from '@/components/json-ld';
import { generateBreadcrumbSchema } from '@/lib/schemas/breadcrumb-schema';

export const metadata: Metadata = {
  title: 'About Warrior Leap | Ice Bath & Cold Plunge Lebanon',
  description:
    'Warrior Leap is Lebanon\'s trusted provider of ice baths, water chillers, and cold plunge equipment. Learn about our story, our ice bath products, and our mission to bring cold therapy to Lebanon.',
  keywords: ['ice bath lebanon', 'cold plunge lebanon', 'warrior leap', 'cold therapy lebanon', 'ice tub lebanon'],
  openGraph: {
    title: 'About Warrior Leap | Ice Bath & Cold Plunge Lebanon',
    description:
      'Lebanon\'s trusted provider of ice baths, water chillers, and cold plunge equipment. Our story and mission.',
    type: 'website',
    url: 'https://warriorleap.com/about',
  },
  alternates: {
    canonical: 'https://warriorleap.com/about',
  },
};

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description:
      'Make high-quality cold therapy accessible across Lebanon through continuous research and rigorous testing.',
  },
  {
    icon: Users,
    title: 'Our Team',
    description:
      'Founded by wellness experts who understand that the right tools drive real results in health and performance.',
  },
  {
    icon: Award,
    title: 'Our Standard',
    description:
      'Every product is built for quality, simplicity, and efficiency — no compromises, no shortcuts.',
  },
];

const promises = [
  { icon: Truck, text: 'Free delivery & installation nationwide' },
  { icon: ShieldCheck, text: 'Warranty on every product' },
  { icon: Headphones, text: 'Responsive local support team' },
];

export default function AboutPage() {
  const breadcrumbs = [
    { name: 'Home', url: 'https://warriorleap.com' },
    { name: 'About', url: 'https://warriorleap.com/about' },
  ];

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      <div className="min-h-screen bg-white">
        {/* Header — matches products page */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">{content.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Lebanon&apos;s trusted source for ice baths, water chillers, and cold plunge systems
            </p>
          </div>
        </div>

        {/* Values */}
        <section className="py-10 md:py-14 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {values.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-brand-dark mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-10 md:py-14 lg:py-16 bg-gray-50 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-brand-dark mb-6 md:mb-8">Our Story</h2>
            <div className="max-w-3xl space-y-4 md:space-y-5">
              {content.description.map((paragraph: string, index: number) => (
                <p key={index} className="text-gray-600 text-sm md:text-base leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Promises */}
        <section className="py-10 md:py-14 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-brand-dark mb-2">Our Promise</h2>
            <p className="text-gray-500 text-sm mb-6 md:mb-8">What you get with every Warrior Leap product</p>
            <div className="max-w-xl space-y-3">
              {promises.map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-xl px-5 py-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-brand-primary" />
                  </div>
                  <p className="text-sm md:text-base font-medium text-gray-700">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 md:py-14 lg:py-16 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-brand-dark mb-2">
              Ready to Start?
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Explore our collection of premium cold therapy products.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 md:px-8 md:py-3 bg-brand-primary text-white font-display font-medium text-sm rounded-lg hover:bg-brand-primary/90 transition-colors"
            >
              View Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
