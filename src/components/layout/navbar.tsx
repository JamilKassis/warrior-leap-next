'use client';

import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { CartButton } from '../cart/cart-button';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const shouldBeScrolled = window.scrollY > 10;
          if (shouldBeScrolled !== isScrolled) {
            setIsScrolled(shouldBeScrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    setIsScrolled(pathname !== '/' || window.scrollY > 10);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, isScrolled]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleNavigation = useCallback((path: string) => {
    setMobileMenuOpen(false);
    router.push(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [router]);

  const handleLogoClick = useCallback(() => {
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
  }, [router, pathname]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'FAQ', path: '/faq' },
  ];

  const isCurrentPath = (path: string) => {
    return pathname === path ||
      (path === '/' && pathname === '/') ||
      (path === '/blog' && pathname.startsWith('/blog'));
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen || !mobileMenuRef.current) return;

    const menuElement = mobileMenuRef.current;
    const focusableElements = menuElement.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const closeButton = menuElement.querySelector<HTMLButtonElement>('[aria-label="Close menu"]');
    closeButton?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    menuElement.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      menuElement.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav
        className="w-full sticky top-0 left-0 right-0"
        style={{
          height: isScrolled ? '64px' : '80px',
          background: isScrolled
            ? 'linear-gradient(to bottom right, rgba(9, 28, 34, 0.92), rgba(9, 28, 34, 0.88))'
            : 'transparent',
          backdropFilter: isScrolled ? 'blur(8px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
          transition: 'height 400ms cubic-bezier(0.16, 1, 0.3, 1), background 400ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 400ms cubic-bezier(0.16, 1, 0.3, 1)',
          transform: 'translateZ(0)',
          zIndex: 50,
          boxShadow: isScrolled
            ? '0 4px 20px rgba(0, 0, 0, 0.25), 0 1px 3px rgba(0, 0, 0, 0.35)'
            : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full relative z-10">
          <div className="flex items-center justify-between h-full overflow-hidden">
            {/* Logo */}
            <div className="flex-shrink-0 min-w-[180px]">
              <button
                onClick={handleLogoClick}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Image
                  src="/assets/images/Logo-White.png"
                  alt="Warrior Leap"
                  width={40}
                  height={40}
                  className="mt-0"
                  style={{
                    height: isScrolled ? '32px' : '40px',
                    width: 'auto',
                    transition: 'all 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                    willChange: 'height',
                    marginTop: '-2px',
                  }}
                  priority
                />
                <span
                  className="text-white font-bold whitespace-nowrap"
                  style={{
                    fontSize: isScrolled ? '1.25rem' : '1.5rem',
                    transition: 'all 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                    willChange: 'font-size',
                  }}
                >
                  Warrior Leap
                </span>
                <span
                  className="ml-2 opacity-90"
                  style={{
                    fontSize: isScrolled ? '0.9rem' : '1.1rem',
                    transition: 'all 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  title="Based in Lebanon"
                >
                  🇱🇧
                </span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 flex-shrink-0">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`group relative text-white hover:text-brand-primary transition-colors duration-300 px-2 py-1 ${
                    isCurrentPath(item.path) ? 'text-brand-primary font-medium' : ''
                  }`}
                >
                  {item.name}
                  {isCurrentPath(item.path) && (
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-brand-primary/50 via-brand-primary to-brand-primary/50 rounded-full shadow-[0_0_8px_0_rgba(73,97,99,0.5)] origin-center scale-x-100 transition-transform duration-300" />
                  )}
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand-primary/20 rounded-full origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Link>
              ))}

              <div className="ml-6 flex-shrink-0 p-1">
                <CartButton />
              </div>
            </div>

            {/* Mobile Menu Button and Cart */}
            <div className="md:hidden flex items-center space-x-3">
              <div className="p-1">
                <CartButton />
              </div>
              <button
                ref={menuButtonRef}
                className="flex items-center justify-center w-10 h-10 text-white focus:outline-none flex-shrink-0"
                onClick={toggleMobileMenu}
                aria-label="Open menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <Menu className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Full Screen */}
      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-0 z-[100] md:hidden transition-all duration-300 ${
          mobileMenuOpen ? 'visible' : 'invisible pointer-events-none'
        }`}
      >
        <div
          className={`absolute inset-0 bg-brand-dark transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div
          className={`relative h-full flex flex-col transition-all duration-300 ${
            mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <div className="flex items-center justify-between px-4 h-16">
            <div className="flex items-center gap-2">
              <Image src="/assets/images/Logo-White.png" alt="Warrior Leap" width={32} height={32} className="h-8 w-auto" />
              <span className="text-white font-bold text-lg">Warrior Leap</span>
            </div>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center px-8">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block w-full text-left text-2xl py-3 border-b border-white/10 transition-colors ${
                    isCurrentPath(item.path)
                      ? 'text-brand-primary font-medium'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="px-8 pb-8">
            <p className="text-white/40 text-sm">Premium Ice Baths in Lebanon</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Navbar);
