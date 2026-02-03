import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ProductNotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-brand-dark mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-8">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link
          href="/"
          className="inline-flex items-center text-brand-primary hover:text-brand-dark transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
