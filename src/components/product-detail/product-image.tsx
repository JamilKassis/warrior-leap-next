'use client';

import { useState, useEffect, useCallback } from 'react';

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

  const primaryIndex = allImages.findIndex((img) => img.isPrimary);
  const initialIndex = primaryIndex >= 0 ? primaryIndex : 0;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [selectedImage, setSelectedImage] = useState(allImages[initialIndex]?.url || image);

  useEffect(() => {
    const primary = productImages.find((img) => img.isPrimary);
    if (primary) {
      setSelectedImage(primary.url);
      const idx = allImages.findIndex((img) => img.url === primary.url);
      setCurrentIndex(idx >= 0 ? idx : 0);
    } else if (allImages.length > 0) {
      setSelectedImage(allImages[0].url);
      setCurrentIndex(0);
    }
  }, [productImages, image]);

  const navigateImage = useCallback(
    (direction: 'next' | 'prev') => {
      if (allImages.length <= 1) return;
      const nextIndex =
        direction === 'next'
          ? (currentIndex + 1) % allImages.length
          : (currentIndex - 1 + allImages.length) % allImages.length;
      setCurrentIndex(nextIndex);
      setSelectedImage(allImages[nextIndex].url);
    },
    [currentIndex, allImages]
  );

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') navigateImage('prev');
      else if (e.key === 'ArrowRight') navigateImage('next');
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigateImage]);

  return (
    <div className="flex flex-col gap-6 h-full w-full">
      {/* Main image */}
      <div className="overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex-1 w-full relative p-4 shadow-sm transition-all duration-300 hover:shadow-md min-w-0 min-h-[500px]">
        {allImages.length > 1 && (
          <>
            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-70 hover:bg-opacity-90 p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110"
              aria-label="Previous image"
            >
              <svg className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => navigateImage('next')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-70 hover:bg-opacity-90 p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110"
              aria-label="Next image"
            >
              <svg className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {allImages.length > 1 && (
          <div className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium">
            {currentIndex + 1} / {allImages.length}
          </div>
        )}

        <div className="h-full w-full relative overflow-hidden">
          <img
            src={selectedImage}
            alt={`${name} - ${allImages[currentIndex]?.alt || 'Product view'}`}
            className="absolute w-auto h-auto max-w-[calc(100%-2rem)] max-h-[calc(100%-2rem)] object-contain transition-all duration-500 hover:scale-105 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== image) target.src = image;
            }}
          />
        </div>
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black ring-opacity-5" />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="p-1.5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm ring-1 ring-inset ring-black ring-opacity-5">
          <div className="flex gap-2 p-1 overflow-x-auto pb-1">
            {allImages.map((img, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setSelectedImage(img.url);
                }}
                className={`relative flex-shrink-0 rounded-lg overflow-hidden w-20 h-20 sm:w-24 sm:h-24 transition-all duration-200 ${
                  currentIndex === index
                    ? 'ring-2 ring-brand-primary shadow-sm'
                    : 'ring-1 ring-gray-100 hover:ring-gray-200'
                }`}
                title={img.alt || `View ${index + 1}`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={img.url}
                    alt={`${name} - ${img.alt || `View ${index + 1}`}`}
                    className="object-contain w-full h-full p-1"
                  />
                </div>
                {currentIndex === index && (
                  <div className="absolute inset-0 bg-brand-primary bg-opacity-10 rounded-lg" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
