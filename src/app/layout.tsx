import type { Metadata, Viewport } from 'next';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'JustThePlumber — Find Local Plumbers with Honest Pricing',
    template: '%s — JustThePlumber',
  },
  description:
    'Find a local plumber with transparent pricing. No middleman, no fees, no markup. Just the plumber, just the price.',
  metadataBase: new URL('https://justtheplumber.co.uk'),
  openGraph: {
    title: 'JustThePlumber — The Fair Trade Plumber Directory',
    description: 'Find a local plumber with honest pricing. No fees. No middleman.',
    siteName: 'JustThePlumber',
    locale: 'en_GB',
    type: 'website',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
