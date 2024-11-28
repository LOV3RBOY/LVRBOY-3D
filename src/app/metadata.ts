import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LVRBOY',
  description: 'Interactive 3D experience by LVRBOY',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#ffc0eb',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'LVRBOY',
    description: 'Interactive 3D experience by LVRBOY',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LVRBOY',
    description: 'Interactive 3D experience by LVRBOY',
  },
}; 