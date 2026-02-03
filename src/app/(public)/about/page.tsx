import type { Metadata } from 'next';
import { Users, Target, Award } from 'lucide-react';
import content from '@/data/about.json';
import JsonLd from '@/components/json-ld';
import { generateBreadcrumbSchema } from '@/lib/schemas/breadcrumb-schema';

export const metadata: Metadata = {
  title: 'About Warrior Leap | Cold Therapy Experts in Lebanon',
  description:
    "Learn about Warrior Leap - Lebanon's premier cold therapy and ice tub provider. Our mission, team, and commitment to wellness.",
  openGraph: {
    title: 'About Warrior Leap | Cold Therapy Experts in Lebanon',
    description:
      "Learn about Warrior Leap - Lebanon's premier cold therapy and ice tub provider. Our mission, team, and commitment to wellness.",
    type: 'website',
    url: 'https://warriorleap.com/about',
  },
  alternates: {
    canonical: 'https://warriorleap.com/about',
  },
};

const cards = [
  {
    icon: Users,
    title: 'Our Team',
    description:
      'Founded by passionate experts in Lebanon who understand that health and performance are driven by the right tools.',
  },
  {
    icon: Target,
    title: 'Our Mission',
    description:
      'To make high-quality wellness products accessible to all through continuous research and testing.',
  },
  {
    icon: Award,
    title: 'Our Difference',
    description:
      'Dedication to quality, simplicity, and efficiency in every product we carefully craft for the Lebanese market.',
  },
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
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12 md:mb-16">
              <div className="w-16 md:w-20 h-1 bg-brand-primary mb-4 mx-auto transform -skew-x-12" />
              <h1 className="text-2xl md:text-3xl font-bold text-brand-dark mb-3">{content.title}</h1>
              <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                Discover our story, mission, and what makes us unique
              </p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-14 md:mb-20">
              {cards.map((card) => (
                <div key={card.title} className="bg-gray-50 rounded-xl p-5 md:p-6 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center mb-4">
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-brand-dark mb-2">{card.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{card.description}</p>
                </div>
              ))}
            </div>

            {/* Our Story */}
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-brand-dark">Our Story</h2>
              </div>
              <div className="space-y-4">
                {content.description.map((paragraph: string, index: number) => (
                  <p key={index} className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
