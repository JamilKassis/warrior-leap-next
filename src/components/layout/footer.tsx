'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Phone, Instagram } from 'lucide-react';
import content from '@/data/footer.json';
import { NewsletterApi } from '@/lib/newsletter-api';

const Footer = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSectionClick = (path: string) => {
    if (path.startsWith('/#')) {
      const sectionId = path.substring(2);
      if (pathname !== '/') {
        router.push(`/?scrollTo=${sectionId}`);
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      router.push(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setMessage(null);

    try {
      const result = await NewsletterApi.subscribe(email, 'footer');
      if (result.success) {
        setMessage({ type: 'success', text: 'Subscribed!' });
        setEmail('');
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to subscribe' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <footer className="bg-gray-50 border-t border-brand-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-12">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-brand-dark font-bold text-xl md:text-2xl mb-3">Warrior Leap</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-md">
              Premium cold therapy products designed to enhance your recovery and wellness journey.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-xs">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="flex-1 px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-primary text-sm disabled:opacity-50"
                required
              />
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? '...' : 'Subscribe'}
              </button>
            </form>
            <div role="status" aria-live="polite" aria-atomic="true">
              {message && (
                <p className={`text-xs mt-1 ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                  {message.text}
                </p>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 md:mt-0">
            <h4 className="text-brand-dark font-semibold text-sm uppercase tracking-wider mb-3">Quick Links</h4>
            <nav aria-label="Quick links">
              <ul className="space-y-2">
                {content.information.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleSectionClick(link.path)}
                      className="text-left text-gray-600 hover:text-brand-primary transition-colors text-sm focus:outline-none focus:text-brand-primary"
                    >
                      {link.text}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-brand-dark font-semibold text-sm uppercase tracking-wider mb-3">Contact</h4>
            <div className="space-y-3.5">
              <a
                href={`tel:${content.contact.phone}`}
                className="flex items-center gap-1.5 text-gray-600 hover:text-brand-primary text-sm"
              >
                <Phone className="w-3.5 h-3.5 text-brand-primary flex-shrink-0" />
                {content.contact.phone}
              </a>
              <a
                href={`https://instagram.com/${content.contact.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-gray-600 hover:text-brand-primary text-sm"
              >
                <Instagram className="w-3.5 h-3.5 text-brand-primary flex-shrink-0" />
                @{content.contact.instagram}
              </a>
              <a
                href={`mailto:${content.contact.email}`}
                className="flex items-center gap-1.5 text-gray-600 hover:text-brand-primary text-sm"
              >
                <Mail className="w-3.5 h-3.5 text-brand-primary flex-shrink-0" />
                {content.contact.email}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-sm text-center mb-2">
            Serving all of Lebanon — Beirut, Tripoli, Sidon, Jounieh & more
          </p>
          <p className="text-gray-500 text-sm text-center">
            {content.copyright.replace('{year}', new Date().getFullYear().toString())}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
