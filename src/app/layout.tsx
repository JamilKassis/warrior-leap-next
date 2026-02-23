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
  description: 'Buy ice bath and ice tub in Lebanon. Premium cold plunge systems, water chillers, and recovery equipment. Best ice bath Lebanon prices. Free delivery and installation in Beirut and all Lebanon.',
  keywords: [
    'ice bath',
    'ice bath lebanon',
    'ice tub',
    'ice tub lebanon',
    'cold plunge',
    'cold plunge lebanon',
    'cold therapy',
    'water chiller',
    'chiller',
    'chiller lebanon',
    'buy ice bath',
    'buy ice bath lebanon',
    'ice bath beirut',
    'portable ice bath',
    'cold water therapy',
    'recovery equipment',
    'ice bath price lebanon',
    'ice bath delivery lebanon',
    'Lebanon',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://warriorleap.com',
    siteName: 'Warrior Leap',
    title: 'Ice Bath Lebanon | Cold Plunge & Ice Tub | Warrior Leap',
    description: 'Buy ice bath and ice tub in Lebanon. Premium cold plunge systems, water chillers, and recovery equipment. Free delivery and installation.',
    images: [{ url: '/assets/images/logo.png', width: 800, height: 600, alt: 'Warrior Leap - Ice Bath & Cold Plunge Lebanon' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ice Bath Lebanon | Cold Plunge & Ice Tub | Warrior Leap',
    description: 'Buy ice bath and ice tub in Lebanon. Premium cold plunge systems, water chillers, and recovery equipment. Free delivery.',
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
  other: {
    'geo.region': 'LB',
    'geo.placename': 'Beirut, Lebanon',
    'geo.position': '33.8938;35.5018',
    'ICBM': '33.8938, 35.5018',
  },
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
