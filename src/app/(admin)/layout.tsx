'use client';

import { AuthProvider } from '@/contexts/auth-context';
import { AdminNavbar } from '@/adminpanel/components/admin-navbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-brand-dark text-white flex">
        <AdminNavbar />
        <div className="hidden lg:block w-72 flex-shrink-0" />
        <main className="flex-1 min-h-screen overflow-x-hidden">
          <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
            <div className="absolute top-0 right-0 w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] bg-brand-primary/10 rounded-full blur-[100px] opacity-50 mix-blend-screen" />
            <div className="absolute bottom-0 left-0 w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] bg-blue-900/10 rounded-full blur-[100px] opacity-30 mix-blend-screen" />
          </div>
          <div className="relative p-2 pt-14 sm:p-4 sm:pt-16 lg:p-8 lg:pt-8" style={{ zIndex: 1 }}>
            {children}
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}
