import type { Metadata } from 'next';
import './globals.css';
import JsonLd from '@/components/json-ld';
import { generateLocalBusinessSchema, generateOrganizationSchema } from '@/lib/schemas/local-business-schema';

export const metadata: Metadata = {
  metadataBase: new URL('https://warriorleap.com'),
  title: {
    default: 'Ice Bath Lebanon | Cold Plunge & Ice Tub | Warrior Leap',
    template: '%s | Warrior Leap',
  },
  description: 'Buy ice bath and ice tub in Lebanon. Premium cold plunge systems, chillers, and recovery equipment. Best ice bath Lebanon prices. Free delivery and installation.',
  keywords: ['ice bath', 'ice bath lebanon', 'ice tub', 'cold therapy', 'cold plunge', 'Lebanon', 'recovery', 'chiller', 'buy ice bath'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://warriorleap.com',
    siteName: 'Warrior Leap',
    title: 'Ice Bath Lebanon | Cold Plunge & Ice Tub | Warrior Leap',
    description: 'Buy ice bath and ice tub in Lebanon. Premium cold plunge systems and chillers. Free delivery and installation.',
    images: [{ url: '/assets/images/logo.png', width: 800, height: 600, alt: 'Warrior Leap Logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ice Bath Lebanon | Cold Plunge & Ice Tub | Warrior Leap',
    description: 'Buy ice bath and ice tub in Lebanon. Premium cold plunge systems and chillers. Free delivery.',
    images: ['/assets/images/logo.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <JsonLd data={[generateLocalBusinessSchema(), generateOrganizationSchema()]} />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
