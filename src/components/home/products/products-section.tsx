'use client';

import Link from 'next/link';
import { ProductCard } from '@/components/shared/product-card';
import { AnimateOnScroll } from '@/components/shared/animate-on-scroll';
import { useProducts } from '@/hooks/use-products';

const ProductsSection = () => {
  const { products, loading, error } = useProducts();

  const content = {
    header: { title: 'Our Products' },
  };

  if (loading) {
    return (
      <section id="products" className="py-16 md:py-24 bg-gradient-to-br from-white via-gray-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <div className="w-24 md:w-32 h-1 bg-brand-primary mb-6 md:mb-8 mx-auto transform -skew-x-12" />
            <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-brand-dark">{content.header.title}</h2>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-brand-light/30 border-t-brand-primary rounded-full animate-spin" />
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="products" className="py-16 md:py-24 bg-gradient-to-br from-white via-gray-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <div className="w-24 md:w-32 h-1 bg-brand-primary mb-6 md:mb-8 mx-auto transform -skew-x-12" />
            <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-brand-dark">{content.header.title}</h2>
          </div>
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-700 font-medium">Unable to load products</p>
              <p className="text-red-600 text-sm mt-2">Please try refreshing the page</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section id="products" className="py-16 md:py-24 bg-gradient-to-br from-white via-gray-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <div className="w-24 md:w-32 h-1 bg-brand-primary mb-6 md:mb-8 mx-auto transform -skew-x-12" />
            <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-brand-dark">{content.header.title}</h2>
          </div>
          <div className="text-center py-12">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-gray-700 font-medium">No products available</p>
              <p className="text-gray-600 text-sm mt-2">New products coming soon!</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-16 md:py-24 bg-gradient-to-br from-white via-gray-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll animation="fade-up" duration="normal" threshold={0.2}>
          <div className="text-center mb-10 md:mb-16">
            <div className="w-24 md:w-32 h-1 bg-brand-primary mb-6 md:mb-8 mx-auto transform -skew-x-12" />
            <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-brand-dark">{content.header.title}</h2>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length > 4 && (
          <AnimateOnScroll animation="fade-up" duration="normal" threshold={0.2} delay={400}>
            <div className="text-center mt-12 md:mt-16">
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-2.5 md:px-8 md:py-3 bg-brand-primary text-white font-display font-medium text-xs md:text-sm rounded-lg hover:bg-brand-primary/90 transition-colors"
              >
                View All Products
              </Link>
            </div>
          </AnimateOnScroll>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
