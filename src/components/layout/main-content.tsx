'use client';

import { usePathname } from 'next/navigation';

const NAVBAR_HEIGHT = 64;

export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <main
      id="main-content"
      className="flex-grow w-full"
      style={{ paddingTop: isHomePage ? 0 : NAVBAR_HEIGHT }}
    >
      {children}
    </main>
  );
}
