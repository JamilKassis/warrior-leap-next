'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const ScrollToTop = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    hasScrolledRef.current = false;
  }, [pathname]);

  useEffect(() => {
    const scrollTo = searchParams.get('scrollTo');

    if (scrollTo && !hasScrolledRef.current) {
      hasScrolledRef.current = true;

      const targetSection = document.getElementById(scrollTo);
      if (targetSection) {
        setTimeout(() => {
          const navbar = document.querySelector('nav');
          const navbarHeight = navbar ? navbar.offsetHeight : 0;
          const targetRect = targetSection.getBoundingClientRect();
          const pageYOffset = window.pageYOffset;

          const offset = -navbarHeight - 24;
          const targetPosition = targetRect.top + pageYOffset + offset;
          const startPosition = pageYOffset;
          const distance = targetPosition - startPosition;

          if (Math.abs(distance) < 100) {
            window.scrollTo(0, targetPosition);
            return;
          }

          const easeInOutCubic = (t: number) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

          let startTime: number | null = null;
          const duration = 1000;

          const animateScroll = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);
            window.scrollTo(0, startPosition + distance * easedProgress);
            if (elapsed < duration) {
              requestAnimationFrame(animateScroll);
            }
          };

          requestAnimationFrame(animateScroll);
        }, 150);
      }
    } else if (!scrollTo) {
      window.scrollTo(0, 0);
    }
  }, [pathname, searchParams]);

  return null;
};

export default ScrollToTop;
