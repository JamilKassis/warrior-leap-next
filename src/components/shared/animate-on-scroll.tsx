'use client';

import React, { ReactNode, useEffect, useState, useRef } from 'react';
import { useInView } from '@/hooks/use-in-view';

interface AnimateOnScrollProps {
  children: ReactNode;
  animation?: 'fade-up' | 'fade-in' | 'slide-up' | 'zoom-in' | 'slide-in-right';
  duration?: 'fast' | 'normal' | 'slow';
  delay?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
}

export const AnimateOnScroll: React.FC<AnimateOnScrollProps> = ({
  children,
  animation = 'fade-up',
  duration = 'normal',
  delay = 0,
  threshold = 0.1,
  className = '',
  once = true,
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const animationRef = useRef<string>('');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const adjustedThreshold = Math.max(threshold, 0.1);

  const [ref, isInView] = useInView<HTMLDivElement>({
    threshold: adjustedThreshold,
    triggerOnce: once,
    rootMargin: '10% 0px',
  });

  const animations = {
    'fade-up': 'opacity-0 translate-y-6',
    'fade-in': 'opacity-0',
    'slide-up': 'opacity-0 translate-y-10',
    'zoom-in': 'opacity-0 scale-95',
    'slide-in-right': 'opacity-0 translate-x-6',
  };

  const durations = {
    fast: 'duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]',
    normal: 'duration-900 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]',
    slow: 'duration-1100 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]',
  };

  if (prefersReducedMotion || hasAnimated) {
    return <div className={className}>{children}</div>;
  }

  const delayStyle = delay ? { transitionDelay: `${Math.min(delay, 200)}ms` } : {};

  if (isInView && !hasAnimated && once) {
    setTimeout(() => {
      setHasAnimated(true);
    }, 1200 + (delay || 0));
  }

  if (!animationRef.current) {
    animationRef.current = animations[animation];
  }

  const styleObject = {
    ...delayStyle,
    willChange: isInView ? 'auto' : ('opacity, transform' as const),
    transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
  };

  return (
    <div
      ref={ref}
      className={`transition-all ${durations[duration]} ${className} ${
        isInView ? 'opacity-100 transform-none' : animationRef.current
      }`}
      style={styleObject}
    >
      {children}
    </div>
  );
};
