'use client';

import { memo, useState, useEffect, useRef } from 'react';
import { heroImages } from './hero-background';

interface HeroContentProps {
  isLoaded: boolean;
  currentImageIndex: number;
}

const HeroContent = ({ isLoaded, currentImageIndex }: HeroContentProps) => {
  const currentImage = heroImages[currentImageIndex];
  const [isSubtitleTransitioning, setIsSubtitleTransitioning] = useState(false);
  const [isDescriptionTransitioning, setIsDescriptionTransitioning] = useState(false);
  const [displayedSubtitle, setDisplayedSubtitle] = useState(currentImage.subtitle);
  const [displayedDescription, setDisplayedDescription] = useState(currentImage.description);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    setIsSubtitleTransitioning(true);
    setIsDescriptionTransitioning(true);

    const timer = setTimeout(() => {
      setDisplayedSubtitle(currentImage.subtitle);
      setDisplayedDescription(currentImage.description);
      setIsSubtitleTransitioning(false);
      setIsDescriptionTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentImage.subtitle, currentImage.description]);

  return (
    <div
      className={`transition-opacity transform duration-700 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } flex flex-col justify-center h-full`}
    >
      <div className="mb-6 sm:mb-8 md:mb-10 text-center relative">
        <h1
          ref={titleRef}
          className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
        >
          {currentImage.title}
        </h1>

        <div className="mt-4 sm:mt-6 text-center">
          <p
            className={`inline text-base sm:text-lg md:text-xl lg:text-2xl text-white font-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide transition-opacity duration-300 ${
              isDescriptionTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
            style={{
              textShadow: '0 0 12px rgba(0,0,0,0.4), 0 0 20px rgba(0,0,0,0.3)',
            }}
          >
            {displayedDescription}
          </p>
        </div>
      </div>

      <div className="text-center">
        <p
          className={`text-base xs:text-lg sm:text-xl md:text-2xl text-white tracking-wider uppercase font-extrabold drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] transition-opacity duration-300 ${
            isSubtitleTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {displayedSubtitle}
        </p>
        <div
          className={`w-16 xs:w-20 sm:w-24 md:w-28 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent mt-2 mx-auto transition-all duration-1000 delay-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0 transform translate-x-8'
          }`}
        />
      </div>
    </div>
  );
};

export default memo(HeroContent);
