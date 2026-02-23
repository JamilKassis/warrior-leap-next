'use client';

import { memo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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
      <div className="mb-4 sm:mb-8 md:mb-10 text-center relative">
        <p
          ref={titleRef}
          className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          aria-hidden="true"
        >
          {currentImage.title}
        </p>

        <div className="mt-3 sm:mt-6 text-center">
          <p
            className={`inline text-sm sm:text-lg md:text-xl lg:text-2xl text-white font-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide transition-opacity duration-300 ${
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
          className={`text-sm xs:text-base sm:text-xl md:text-2xl text-white tracking-wider uppercase font-extrabold drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] transition-opacity duration-300 ${
            isSubtitleTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {displayedSubtitle}
        </p>
        <div
          className={`w-12 xs:w-16 sm:w-24 md:w-28 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent mt-2 mx-auto transition-all duration-1000 delay-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0 transform translate-x-8'
          }`}
        />

        <div
          className={`mt-6 sm:mt-8 transition-all duration-700 delay-300 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-7 py-3 sm:px-9 sm:py-3.5 border border-white/40 text-white font-display font-medium text-sm sm:text-base rounded-full backdrop-blur-sm bg-white/10 hover:bg-white/20 hover:border-white/60 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300 active:scale-[0.97]"
          >
            Explore Products
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default memo(HeroContent);
