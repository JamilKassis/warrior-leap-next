import type { Metadata } from 'next';
import './globals.css';
import JsonLd from '@/components/json-ld';
import { generateLocalBusinessSchema, generateOrganizationSchema } from '@/lib/schemas/local-business-schema';

export const metadata: Metadata = {
  metadataBase: new URL('https://warriorleap.com'),
  title: {
    default: 'Warrior Leap | Premium Ice Baths & Cold Therapy in Lebanon',
    template: '%s | Warrior Leap',
  },
  description: 'Premium ice bath and cold therapy equipment in Lebanon. Professional-grade cold plunge tubs for athletes, fitness enthusiasts, and wellness seekers. Free delivery across Lebanon.',
  keywords: ['ice bath', 'cold therapy', 'cold plunge', 'Lebanon', 'recovery', 'athlete', 'wellness', 'ice tub'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://warriorleap.com',
    siteName: 'Warrior Leap',
    title: 'Warrior Leap | Premium Ice Baths & Cold Therapy in Lebanon',
    description: 'Premium ice bath and cold therapy equipment in Lebanon. Professional-grade cold plunge tubs for athletes, fitness enthusiasts, and wellness seekers.',
    images: [{ url: '/assets/images/logo.png', width: 800, height: 600, alt: 'Warrior Leap Logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Warrior Leap | Premium Ice Baths & Cold Therapy in Lebanon',
    description: 'Premium ice bath and cold therapy equipment in Lebanon.',
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
