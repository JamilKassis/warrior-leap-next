'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { ProductWithInventory } from '@/types/inventory';
import ProductImage from './product-image';
import ProductPrice from './product-price';
import ProductSpecifications from './product-specifications';
import ProductWarranty from './product-warranty';
import RelatedProducts from './related-products';
import StickyMobileCart from './sticky-mobile-cart';

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
  const router = useRouter();
  const [isMainCartVisible, setIsMainCartVisible] = useState(true);
  const addToCartRef = useRef<HTMLDivElement>(null);

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

  const handleBackToProducts = () => {
    router.push('/?scrollTo=products');
  };

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
      {/* Breadcrumb nav */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm text-gray-500">
            <button
              onClick={handleBackToProducts}
              className="flex items-center text-brand-primary hover:text-brand-dark transition-colors font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Products
            </button>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="font-medium text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Name */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 lg:items-stretch">
          {/* Image */}
          <div className="flex items-stretch w-full min-w-0 h-full">
            <ProductImage image={primaryImage} name={product.name} productImages={mappedImages} />
          </div>

          {/* Details */}
          <div className="flex flex-col h-full">
            <div className="mb-2">
              <ProductPrice
                price={product.price}
                originalPrice={product.original_price}
                preorderPrice={product.preorder_price}
                depositAmount={product.deposit_amount}
                status={product.computed_status || 'active'}
                availableQuantity={product.available_quantity}
              />
            </div>

            {/* Add to Cart */}
            <div ref={addToCartRef} className="mb-4">
              <AddToCartButton product={product} variant="primary" size="lg" className="w-full" />
            </div>

            {/* Specifications */}
            <div className="flex-1">
              <ProductSpecifications specifications={product.specifications} productName={product.name} />
            </div>
          </div>
        </div>

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
