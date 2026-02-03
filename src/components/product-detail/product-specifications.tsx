import {
  Shield,
  Thermometer,
  Wrench,
  Target,
  Droplet,
  Timer,
  Maximize2,
  Layers,
  Package,
  Lock,
  AlertTriangle,
  Briefcase,
  Zap,
  Cpu,
  Filter,
  ListChecks,
} from 'lucide-react';
import { ProductSpecification } from '@/types/inventory';

interface ProductSpecificationsProps {
  specifications?: ProductSpecification[];
  productName?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  Thermometer: <Thermometer />,
  Wrench: <Wrench />,
  Target: <Target />,
  Filter: <Filter />,
  Shield: <Shield />,
  Briefcase: <Briefcase />,
  Maximize2: <Maximize2 />,
  Timer: <Timer />,
  Layers: <Layers />,
  Droplet: <Droplet />,
  Lock: <Lock />,
  AlertTriangle: <AlertTriangle />,
  Package: <Package />,
  Zap: <Zap />,
  Cpu: <Cpu />,
};

function getIcon(iconName?: string) {
  const icon = iconMap[iconName || 'Shield'] || <Shield />;
  return icon;
}

const fallbackSpecs: ProductSpecification[] = [
  {
    title: 'Product Details',
    description: 'For specific details about this product, please contact customer support.',
    icon: 'Cpu',
  },
  {
    title: 'Warranty Information',
    description: 'All products come with our standard warranty.',
    icon: 'Shield',
  },
];

export default function ProductSpecifications({ specifications = [] }: ProductSpecificationsProps) {
  const specs = specifications.length > 0 ? specifications : fallbackSpecs;

  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg h-full flex flex-col">
      <h3 className="text-lg font-bold text-brand-dark mb-4 flex items-center">
        <ListChecks className="mr-2 h-5 w-5 text-brand-primary" />
        Product Specifications
      </h3>

      <div className="flex-grow">
        <div className="w-full border-collapse rounded-lg overflow-hidden border border-brand-primary/20 shadow-sm">
          {specs.map((spec, index) => (
            <div
              key={index}
              className={`group flex flex-col sm:flex-row items-start sm:items-center ${
                index % 2 === 0 ? 'bg-white hover:bg-brand-light/20' : 'bg-brand-light/30 hover:bg-brand-light/50'
              } ${index === specs.length - 1 ? '' : 'border-b border-brand-primary/20'} transition-colors duration-150`}
            >
              <div className="py-3 pl-4 pr-2 w-full sm:w-[38%] flex items-center">
                <div className="w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0 rounded-full bg-brand-light/50 group-hover:scale-110 transition-transform duration-200">
                  <span className="[&>svg]:w-4 [&>svg]:h-4 [&>svg]:text-brand-primary/80 [&>svg]:stroke-2">
                    {getIcon(spec.icon)}
                  </span>
                </div>
                <span className="font-semibold text-[15px] text-brand-dark">{spec.title}</span>
              </div>
              <div className="py-1.5 sm:py-3 pl-14 sm:pl-2 pr-4 w-full sm:w-[62%] text-brand-dark/80 text-[14px]">
                {spec.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-brand-light/40 to-brand-primary/10 p-3 rounded-lg mt-4 text-xs text-brand-dark/80 border border-brand-primary/20 flex items-start">
        <Shield className="h-4 w-4 text-brand-primary mt-0.5 mr-2 flex-shrink-0" />
        <div>
          <span className="font-medium text-brand-primary">Note:</span> Specifications may vary slightly based on
          production batch. All products meet or exceed industry standards.
        </div>
      </div>
    </div>
  );
}
