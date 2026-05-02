import { TruckIcon, MapPinIcon, SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const STEPS = [
  { icon: MapPinIcon, title: 'You book', body: 'Pick a date and place.' },
  { icon: TruckIcon, title: 'We bring it', body: 'Deliver, set up, and chill it.' },
  { icon: SparklesIcon, title: 'You plunge', body: 'On your own or with a coach.' },
  { icon: CheckCircleIcon, title: 'We pick up', body: 'When you’re done — we handle it.' },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="relative py-20 md:py-28 lg:py-32 bg-gradient-to-br from-white via-gray-50/30 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <div className="w-12 md:w-16 lg:w-20 h-1 bg-brand-primary mb-4 md:mb-5 mx-auto transform -skew-x-12" />
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-brand-dark">
            From booked to plunged in 4 steps
          </h2>
          <p className="text-gray-500 text-sm md:text-base mt-3 max-w-lg mx-auto">
            Tell us when and where. We handle the rest.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="group relative rounded-2xl border border-gray-200 bg-white p-7 md:p-8 hover:border-brand-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center group-hover:bg-brand-primary group-hover:border-brand-primary transition-colors">
                  <step.icon className="w-6 h-6 text-brand-primary group-hover:text-white transition-colors" />
                </div>
                <span className="text-5xl font-display font-bold text-brand-primary/30">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="text-lg font-display font-semibold text-brand-dark mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
