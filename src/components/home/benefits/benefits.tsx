'use client';

import { useMemo, memo } from 'react';
import { Thermometer, Brain, Dumbbell, Heart } from 'lucide-react';
import content from '@/data/information.json';

interface SectionItem {
  icon: 'Thermometer' | 'Brain' | 'Dumbbell' | 'Heart';
  title: string;
  description: string;
  image: string;
  includes: string[];
  path: string;
}

const iconMap = { Thermometer, Brain, Dumbbell, Heart };

const FeatureCard = memo(({ section, index }: { section: SectionItem; index: number }) => {
  const Icon = iconMap[section.icon];

  return (
    <div className="group bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-7 hover:bg-white/15 transition-all duration-300 h-full flex flex-col">
      <div className="flex items-center mb-4">
        <div className="p-2.5 rounded-xl bg-brand-primary/30 text-white">
          <Icon className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <h3 className="text-lg md:text-xl font-bold ml-3 text-white">{section.title}</h3>
      </div>

      <ul className="space-y-2 mt-auto">
        {section.includes.map((item: string, idx: number) => (
          <li key={idx} className="text-white/70 text-sm flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mr-2.5 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
});

FeatureCard.displayName = 'FeatureCard';

const Benefits = () => {
  const filteredSections = useMemo(
    () => content.sections.filter((section) => section.title !== 'Cold Immersion Therapy') as SectionItem[],
    []
  );

  return (
    <section id="benefits" className="relative py-16 md:py-24 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <div className="w-20 md:w-24 h-1 bg-brand-primary mb-5 mx-auto transform -skew-x-12" />
          <h2 className="text-3xl md:text-4xl font-bold text-white">{content.title}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-8">
          {filteredSections.map((section, index) => (
            <FeatureCard key={index} section={section} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
