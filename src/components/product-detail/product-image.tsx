'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface ProductImageItem {
  url: string;
  alt: string;
  isPrimary?: boolean;
}

interface ProductImageProps {
  image: string;
  name: string;
  productImages?: ProductImageItem[];
}

export default function ProductImage({ image, name, productImages = [] }: ProductImageProps) {
  const allImages: ProductImageItem[] =
    productImages.length > 0
      ? productImages
      : [{ url: image, alt: 'Product Image' }];

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current || isScrolling.current) return;
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const width = container.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < allImages.length) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex, allImages.length]);

  const scrollToIndex = useCallback((index: number) => {
    if (!scrollRef.current) return;
    isScrolling.current = true;
    scrollRef.current.scrollTo({
      left: index * scrollRef.current.offsetWidth,
      behavior: 'smooth',
    });
    setActiveIndex(index);
    setTimeout(() => { isScrolling.current = false; }, 400);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const hasMultiple = allImages.length > 1;

  return (
    <>
      {/* Mobile: Swipeable carousel */}
      <div className="lg:hidden">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {allImages.map((img, index) => (
            <div key={index} className="w-full flex-shrink-0 snap-center flex items-center justify-center bg-gradient-to-br from-gray-50 to-stone-100">
              <img
                src={img.url}
                alt={`${name} - ${img.alt || `View ${index + 1}`}`}
                className="w-full max-h-[55vh] object-contain p-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== image) target.src = image;
                }}
              />
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        {hasMultiple && (
          <div className="flex justify-center gap-2 mt-3">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`rounded-full transition-all duration-200 ${
                  index === activeIndex
                    ? 'w-6 h-2 bg-brand-primary'
                    : 'w-2 h-2 bg-gray-300'
                }`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: Vertical stack */}
      <div className="hidden lg:flex flex-col gap-6">
        {allImages.map((img, index) => (
          <img
            key={index}
            src={img.url}
            alt={`${name} - ${img.alt || `View ${index + 1}`}`}
            className="w-full h-auto object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== image) target.src = image;
            }}
          />
        ))}
      </div>
    </>
  );
}
