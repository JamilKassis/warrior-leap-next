'use client';

import { useState, useEffect, useRef } from 'react';
import { Minus, Plus, Truck, ShieldCheck, MessageCircle } from 'lucide-react';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { ProductWithInventory } from '@/types/inventory';
import ProductImage from './product-image';
import ProductPrice from './product-price';
import ProductHighlights from './product-highlights';
import ProductSpecifications from './product-specifications';
import ProductWarranty from './product-warranty';
import RelatedProducts from './related-products';
import StickyMobileCart from './sticky-mobile-cart';
import { useWarranty } from '@/hooks/use-warranty';

interface ProductImageData {
  image_url: string;
  image_alt: string;
  is_primary: boolean;
  sort_order: number;
}

interface ProductDetailClientProps {
  product: ProductWithInventory;
  productImages: ProductImageData[];
}

export default function ProductDetailClient({ product, productImages }: ProductDetailClientProps) {
  const [isMainCartVisible, setIsMainCartVisible] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addToCartRef = useRef<HTMLDivElement>(null);
  const { warranty } = useWarranty();

  const primaryImage =
    productImages.find((img) => img.is_primary)?.image_url || product.image_url || '/assets/images/Logo-White.png';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product.id]);

  useEffect(() => {
    const element = addToCartRef.current;
    if (!element) return;

    const checkIfScrolledPast = () => {
      const rect = element.getBoundingClientRect();
      setIsMainCartVisible(rect.bottom >= 0);
    };

    window.addEventListener('scroll', checkIfScrolledPast, { passive: true });
    checkIfScrolledPast();
    return () => window.removeEventListener('scroll', checkIfScrolledPast);
  }, []);

  const mappedImages =
    productImages.length > 0
      ? productImages.map((img) => ({
          url: img.image_url,
          alt: img.image_alt,
          isPrimary: img.is_primary,
        }))
      : undefined;

  return (
    <div className="bg-white">
      {/* Product hero — full-width so grey hits left browser edge */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_560px] mb-10">
        {/* Image column — grey bg naturally reaches left edge */}
        <div className="bg-gradient-to-br from-gray-50 to-stone-100 flex items-center justify-center px-4 py-4 lg:py-10 lg:px-12">
          <div className="w-full max-w-2xl">
            <ProductImage image={primaryImage} name={product.name} productImages={mappedImages} />
          </div>
        </div>

        {/* Details — sticky on desktop */}
        <div className="lg:sticky lg:top-[88px] lg:self-start flex flex-col px-4 sm:px-6 lg:pl-8 lg:pr-8 xl:pr-16 pt-4 lg:pt-8">
          {/* Product Title */}
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-2 md:mb-4">{product.name}</h1>

          {/* Product Description */}
          {product.description && (
            <p className="text-sm md:text-base text-gray-500 mb-4 md:mb-6 leading-relaxed">{product.description}</p>
          )}

          <ProductPrice
            price={product.price}
            originalPrice={product.original_price}
            preorderPrice={product.preorder_price}
            status={product.computed_status || 'active'}
          />

          {/* Product Highlights */}
          {product.features && product.features.length > 0 && (
            <ProductHighlights features={product.features} />
          )}

          {/* Add to Cart with Quantity */}
          <div ref={addToCartRef} className="mb-4 flex items-stretch gap-2 md:gap-3">
            {/* Quantity selector - hidden when sold out */}
            {!(product.computed_status === 'out_of_stock' || product.computed_status === 'preorder' || product.computed_status === 'inactive' || (product.available_quantity !== undefined && product.available_quantity <= 0)) && (
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-3 md:px-4 md:py-4 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-2 py-3 md:px-4 md:py-4 text-base md:text-lg font-semibold text-gray-900 min-w-[2.5rem] md:min-w-[3rem] text-center tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-3 md:px-4 md:py-4 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
            <AddToCartButton product={product} quantity={quantity} variant="primary" size="lg" className="flex-1" />
          </div>

          {/* Info block */}
          <div className="flex flex-wrap items-center gap-x-3 md:gap-x-4 gap-y-2 text-xs md:text-sm text-gray-500 mt-1">
            <div className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span>Free delivery</span>
            </div>
            <span className="text-gray-300">·</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span>{warranty ? `${warranty.duration_months}-month warranty` : 'Warranty included'}</span>
            </div>
            <span className="text-gray-300">·</span>
            <div className="flex items-center gap-1.5">
              {product.computed_status === 'out_of_stock' || product.computed_status === 'preorder' || (product.available_quantity !== undefined && product.available_quantity <= 0) ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span>Out of stock</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span>In stock</span>
                </>
              )}
            </div>
          </div>

          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/96171457820"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 mt-4 md:mt-5 py-2.5 md:py-3 bg-gray-50 rounded-lg text-xs md:text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-green-600" />
            <span>Have questions? Chat with us on WhatsApp</span>
          </a>

        </div>
      </div>

      {/* Specifications, Warranty, Related — content width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 md:pb-8">
        {/* Specifications */}
        <ProductSpecifications specifications={product.specifications} productName={product.name} />

        {/* Warranty */}
        <ProductWarranty />

        {/* Related */}
        <RelatedProducts currentProductName={product.name} />
      </div>

      {/* Sticky Mobile Cart */}
      <StickyMobileCart
        product={{
          id: product.id,
          name: product.name,
          price: product.price,
          image: primaryImage,
          description: product.description,
          computed_status: product.computed_status || 'active',
        }}
        showWhenMainHidden={!isMainCartVisible}
      />
    </div>
  );
}
