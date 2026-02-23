import { Zap, Brain, Dumbbell, Heart } from 'lucide-react';

const benefits = [
  {
    icon: Zap,
    title: 'Faster Recovery',
    description:
      'Cold exposure reduces inflammation and muscle soreness, getting you back to training sooner.',
  },
  {
    icon: Brain,
    title: 'Mental Clarity',
    description:
      'Regular cold immersion sharpens focus, reduces stress, and builds real mental toughness.',
  },
  {
    icon: Dumbbell,
    title: 'Peak Performance',
    description:
      'Athletes use cold therapy to push harder, prevent injury, and adapt faster between sessions.',
  },
  {
    icon: Heart,
    title: 'Better Health',
    description:
      'Boost your immune system, improve sleep quality, and support cardiovascular health naturally.',
  },
];

const Benefits = () => {
  return (
    <section id="benefits" className="relative py-14 md:py-20 lg:py-28 bg-brand-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14 lg:mb-16">
          <div className="w-14 md:w-20 lg:w-24 h-1 bg-brand-primary mb-4 md:mb-5 mx-auto transform -skew-x-12" />
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white/90">
            Benefits of Ice Bath & Cold Therapy
          </h2>
          <p className="text-white/50 text-sm md:text-base mt-3 max-w-lg mx-auto">
            Science-backed benefits of cold plunge that transform how you recover, think, and perform.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-brand-primary/20 mb-4 md:mb-5">
                  <Icon className="w-6 h-6 md:w-7 md:h-7 text-brand-primary" />
                </div>
                <h3 className="text-sm md:text-base lg:text-lg font-bold text-white/85 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-white/60 text-xs md:text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
