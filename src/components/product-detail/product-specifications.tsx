'use client';

import { useState } from 'react';
import { ChevronDown, ClipboardList } from 'lucide-react';
import { ProductSpecification } from '@/types/inventory';
import { getFeatureIcon } from '@/lib/icon-mapping';

interface ProductSpecificationsProps {
  specifications?: ProductSpecification[];
  productName?: string;
}

export default function ProductSpecifications({ specifications = [] }: ProductSpecificationsProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (specifications.length === 0) return null;

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 text-left group"
      >
        <span className="text-base md:text-lg font-semibold text-brand-dark flex items-center">
          <ClipboardList className="mr-2 h-5 w-5 text-brand-primary" />
          Specifications
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 group-hover:text-brand-primary transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
            {specifications.map((spec, index) => {
              const Icon = spec.icon ? getFeatureIcon(spec.icon) : null;
              return (
                <div
                  key={index}
                  className={`flex items-start md:items-center px-3 md:px-4 py-3 md:py-3.5 text-sm ${
                    index % 2 === 1 ? 'bg-gray-50' : 'bg-white'
                  } ${index > 0 ? 'border-t border-gray-100' : ''}`}
                >
                  {Icon && (
                    <div className="flex-shrink-0 mr-2 md:mr-3 mt-0.5 md:mt-0">
                      <Icon className="h-4 w-4 text-brand-primary/60" />
                    </div>
                  )}
                  <div className="flex flex-col md:flex-row md:items-center min-w-0 flex-1">
                    <span className="text-gray-500 md:w-40 flex-shrink-0 font-medium text-xs md:text-sm">{spec.title}</span>
                    <span className="text-gray-900 text-sm mt-0.5 md:mt-0">{spec.description}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
