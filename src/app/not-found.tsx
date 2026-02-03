import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark">
      <div className="text-center px-4">
        <h1 className="text-8xl font-bold text-brand-primary mb-4">404</h1>
        <h2 className="text-2xl font-display text-white mb-4">Page Not Found</h2>
        <p className="text-brand-light mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-brand-primary text-white px-8 py-3 rounded-lg hover:bg-brand-primary/80 transition-colors font-medium"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
