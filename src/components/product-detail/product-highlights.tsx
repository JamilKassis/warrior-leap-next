import { ProductFeature } from '@/types/inventory';
import { getFeatureIcon } from '@/lib/icon-mapping';

interface ProductHighlightsProps {
  features: (string | ProductFeature)[];
}

export default function ProductHighlights({ features }: ProductHighlightsProps) {
  if (!features || features.length === 0) {
    return null;
  }

  // Limit to 5 features max
  const displayFeatures = features.slice(0, 5);

  return (
    <div className="mb-5">
      <ul className="flex flex-col gap-2">
        {displayFeatures.map((feature, index) => {
          const isString = typeof feature === 'string';
          const text = isString ? feature : feature.text;
          const iconName = isString ? 'Check' : feature.icon;
          const Icon = getFeatureIcon(iconName);

          return (
            <li key={index} className="flex items-center gap-2.5">
              <Icon className="w-4 h-4 text-brand-primary flex-shrink-0" />
              <span className="text-sm text-gray-700">{text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
