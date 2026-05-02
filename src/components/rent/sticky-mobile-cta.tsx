'use client';

import { useEffect, useState } from 'react';

const StickyMobileCTA = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const form = document.getElementById('contact');
      if (!form) {
        setVisible(window.scrollY > 600);
        return;
      }
      const rect = form.getBoundingClientRect();
      const formInView = rect.top < window.innerHeight && rect.bottom > 0;
      setVisible(window.scrollY > 600 && !formInView);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className={`md:hidden fixed bottom-4 left-4 right-4 z-40 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
    >
      <button
        type="button"
        onClick={scrollToContact}
        className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full bg-brand-primary text-white text-sm font-medium shadow-2xl shadow-black/50"
      >
        Call us for a quote
      </button>
    </div>
  );
};

export default StickyMobileCTA;
