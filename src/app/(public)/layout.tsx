import { Suspense } from 'react';
import { CartProvider } from '@/contexts/cart-context';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { MainContent } from '@/components/layout/main-content';
import WhatsAppButton from '@/components/shared/whatsapp-button';
import ScrollToTop from '@/components/shared/scroll-to-top';
import { CartSidebar } from '@/components/cart/cart-sidebar';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-brand-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      <div className="min-h-screen flex flex-col bg-white overflow-x-hidden w-full">
        {/* Background Pattern Overlay - GPU-promoted to avoid scroll repaint */}
        <div
          className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-20"
          style={{ backgroundSize: '30px 30px', transform: 'translateZ(0)' }}
        />

        {/* Fixed Header */}
        <header
          className="fixed top-0 left-0 right-0 z-50 flex flex-col"
          style={{ background: 'transparent', isolation: 'isolate' }}
        >
          <Navbar />
        </header>

        {/* Content */}
        <div className="relative flex flex-col flex-grow w-full">
          <MainContent>
            {children}
          </MainContent>
          <Footer />
        </div>

        {/* WhatsApp Button */}
        <WhatsAppButton phoneNumber="+961 71 457 820" />

        {/* Scroll to top handler */}
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>

        {/* Cart Sidebar */}
        <CartSidebar />
      </div>
    </CartProvider>
  );
}
