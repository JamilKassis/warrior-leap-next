'use client';

import { useEffect, useState } from 'react';
import slideshowData from '@/data/heroSlideshow.json';

const imageMap: Record<string, { desktop: string; mobile: string }> = {
  'Girl chilling in ice tub.webp': {
    desktop: '/assets/images/Girl chilling in ice tub.webp',
    mobile: '/assets/images/Girl chilling in ice tub-mobile.webp',
  },
  'Girl Entering Ice Tub.webp': {
    desktop: '/assets/images/Girl Entering Ice Tub.webp',
    mobile: '/assets/images/Girl Entering Ice Tub-mobile.webp',
  },
  'Man on ice looking down.webp': {
    desktop: '/assets/images/Man on ice looking down.webp',
    mobile: '/assets/images/Man on ice looking down-mobile.webp',
  },
  'Dipped face in ice.webp': {
    desktop: '/assets/images/Dipped face in ice.webp',
    mobile: '/assets/images/Dipped face in ice-mobile.webp',
  },
};

export const heroImages = slideshowData.map((item) => ({
  ...item,
  src: imageMap[item.image].desktop,
  mobileSrc: imageMap[item.image].mobile,
}));

interface HeroBackgroundProps {
  isLoaded: boolean;
  onImageChange?: (index: number) => void;
}

const HeroBackground = ({ isLoaded, onImageChange }: HeroBackgroundProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    heroImages.forEach((image) => {
      const img = new Image();
      img.src = image.src;
    });
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        const newIndex = (currentImageIndex + 1) % heroImages.length;
        setCurrentImageIndex(newIndex);
        if (onImageChange) {
          onImageChange(newIndex);
        }
        setTimeout(() => {
          setIsTransitioning(false);
        }, 100);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, [isLoaded, currentImageIndex, onImageChange]);

  return (
    <div className={`absolute inset-0 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/95 via-[#0a2530]/90 to-[#132730]/85" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/3 left-1/2 w-full h-full rotate-12 bg-gradient-to-b from-brand-primary/20 via-transparent to-transparent opacity-40 transform -translate-x-1/2" />
      </div>

      <div className="absolute inset-0 opacity-70 mix-blend-normal overflow-hidden">
        {heroImages.map((image, index) => (
          <picture
            key={index}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              index === currentImageIndex ? (isTransitioning ? 'opacity-0' : 'opacity-100') : 'opacity-0'
            }`}
          >
            <source srcSet={image.mobileSrc} media="(max-width: 767px)" type="image/webp" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.alt || `${image.title} - ${image.description}`}
              className="w-full h-full object-cover"
              style={{
                objectPosition: image.position,
                filter: 'contrast(1.15) brightness(0.8) saturate(1.05)',
              }}
              loading={index === 0 ? 'eager' : 'lazy'}
              width="1920"
              height="1080"
              decoding="async"
            />
          </picture>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/40 to-transparent" />
    </div>
  );
};

export default HeroBackground;
