'use client';

import { useEffect, useState, memo, useCallback, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import HeroBackground, { heroImages } from './hero-background';
import HeroContent from './hero-content';

const MemoizedHeroBackground = memo(HeroBackground);
const MemoizedHeroContent = memo(HeroContent);

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [heroHeight, setHeroHeight] = useState('100vh');
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const calculateHeroHeight = () => {
      const vh = window.visualViewport?.height || window.innerHeight;
      setHeroHeight(`${vh}px`);
    };
    calculateHeroHeight();
    window.addEventListener('resize', calculateHeroHeight);
    window.visualViewport?.addEventListener('resize', calculateHeroHeight);
    return () => {
      window.removeEventListener('resize', calculateHeroHeight);
      window.visualViewport?.removeEventListener('resize', calculateHeroHeight);
    };
  }, []);

  useEffect(() => {
    const preloadImages = async () => {
      try {
        setIsLoading(true);
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
          const img = new window.Image();
          img.src = heroImages[0].src;
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject();
          });
          requestAnimationFrame(() => {
            setIsLoading(false);
            setIsLoaded(true);
          });
          setTimeout(() => {
            heroImages.slice(1).forEach((image) => {
              const bgImg = new window.Image();
              bgImg.src = image.src;
            });
          }, 2000);
        } else {
          const imagePromises = heroImages.map(
            (image) =>
              new Promise<void>((resolve, reject) => {
                const img = new window.Image();
                img.src = image.src;
                img.onload = () => resolve();
                img.onerror = () => reject();
              })
          );
          await Promise.all(imagePromises);
          requestAnimationFrame(() => {
            setIsLoading(false);
            setIsLoaded(true);
          });
        }
      } catch {
        requestAnimationFrame(() => {
          setIsLoading(false);
          setIsLoaded(true);
        });
      }
    };

    preloadImages();
  }, []);

  const handleImageChange = useCallback((index: number) => {
    setCurrentImageIndex(index);
  }, []);

  const scrollToProducts = useCallback(() => {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-full overflow-hidden"
      style={{ height: heroHeight }}
    >
      {isLoading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-brand-dark">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-white text-lg">Loading experience...</p>
          </div>
        </div>
      )}

      <MemoizedHeroBackground isLoaded={isLoaded} onImageChange={handleImageChange} />

      <div className="relative h-full flex flex-col">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full flex flex-col flex-grow">
          <div className="flex-grow flex flex-col justify-center pt-[72px] sm:pt-[90px] md:pt-[100px]">
            <MemoizedHeroContent isLoaded={isLoaded} currentImageIndex={currentImageIndex} />
          </div>
        </div>

        <div
          className={`absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button
            onClick={scrollToProducts}
            className="group flex flex-col items-center space-y-0"
            aria-label="Scroll down to view our products"
          >
            <span className="text-xs uppercase tracking-[0.2em] text-white/90 group-hover:text-white transition-colors duration-300">
              Scroll
            </span>
            <div className="relative w-6 h-10 rounded-full border-2 border-white/60 group-hover:border-white transition-colors duration-300 mt-1">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/90 rounded-full animate-scroll-down" />
            </div>
            <ChevronDown
              size={20}
              className="text-white/90 group-hover:text-white transition-colors duration-300 animate-bounce mt-0"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default memo(Hero);
