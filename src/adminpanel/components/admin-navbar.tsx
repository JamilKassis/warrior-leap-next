'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ChatBubbleLeftRightIcon,
  CubeIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Package } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: ChatBubbleLeftRightIcon, exact: true },
  { name: 'Products', href: '/admin/products', icon: CubeIcon },
  { name: 'Inventory', href: '/admin/inventory', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ClipboardDocumentListIcon },
  { name: 'Blog', href: '/admin/blog', icon: DocumentTextIcon },
  { name: 'Newsletter', href: '/admin/newsletter', icon: EnvelopeIcon },
  { name: 'Warranties', href: '/admin/warranties', icon: ShieldCheckIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
];

function SidebarContent({ onNavClick, onLogout }: { onNavClick: () => void; onLogout: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      <div className="px-6 py-8 flex items-center space-x-3">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-primary to-cyan-700 flex items-center justify-center shadow-lg shadow-brand-primary/20">
          <span className="text-white font-bold text-lg">W</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-wide">Warrior Leap</h2>
      </div>

      <div className="px-3 flex-1 overflow-y-auto space-y-1">
        <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Menu</div>
        {navigation.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavClick}
              className={`relative group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                active ? 'text-white bg-brand-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon
                className={`h-5 w-5 mr-3 transition-colors duration-200 ${
                  active ? 'text-brand-light' : 'text-gray-500 group-hover:text-gray-300'
                }`}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-400 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200 group"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3 group-hover:translate-x-1 transition-transform" />
          Logout
        </button>
      </div>
    </>
  );
}

export function AdminNavbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleNavClick = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-brand-dark border-b border-white/10 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-brand-primary to-cyan-700 flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <h2 className="text-sm font-bold text-white">Warrior Leap</h2>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          {isMobileMenuOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden fixed top-0 left-0 h-screen w-72 bg-brand-dark border-r border-white/10 flex flex-col z-50 shadow-2xl">
          <SidebarContent onNavClick={handleNavClick} onLogout={handleLogout} />
        </nav>
      )}

      {/* Desktop sidebar */}
      <nav className="hidden lg:flex fixed top-0 left-0 h-screen w-72 bg-brand-dark border-r border-white/10 flex-col z-50 shadow-2xl">
        <SidebarContent onNavClick={handleNavClick} onLogout={handleLogout} />
      </nav>
    </>
  );
}
