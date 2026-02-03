'use client';

import React, { useEffect, useState } from 'react';

export const BANNER_HEIGHT = 36;

const MovingBanner = () => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setReducedMotion(true);
    }

    const handleChange = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="bg-gradient-to-r from-brand-primary/90 via-brand-primary to-brand-primary/90 text-white overflow-hidden shadow-md w-full">
      <div className="flex justify-center items-center h-9">
        <div className="flex items-center text-center text-sm font-semibold">
          <span className={reducedMotion ? '' : 'mr-2 animate-bounce-delayed'}>🚚</span>
          <span className="inline-block drop-shadow-sm">FREE DELIVERY ALL OVER LEBANON</span>
          <span className={reducedMotion ? '' : 'ml-2 animate-bounce'}>🚚</span>
        </div>
      </div>
    </div>
  );
};

export default MovingBanner;
