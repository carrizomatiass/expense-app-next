import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Control de Finanzas - Gestiona tus ingresos y gastos',
  description:
    'Aplicación web para gestionar tus finanzas personales. Controla ingresos, gastos, categorías y obtén reportes detallados de tu balance financiero.',
  keywords: [
    'finanzas',
    'gastos',
    'ingresos',
    'presupuesto',
    'dinero',
    'control financiero',
    'ahorro',
  ],
  authors: [{ name: 'Matias Carrizo' }],
  creator: 'Matias Carrizo',
  publisher: 'Matias Carrizo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://expense-app-next.vercel.app/expenses'), // Cambia por tu URL de Vercel
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Control de Finanzas - Gestiona tu dinero inteligentemente',
    description:
      'Controla tus ingresos y gastos de manera inteligente. Organiza por categorías, visualiza reportes y mantén tu balance financiero bajo control.',
    url: 'https://expense-app-next.vercel.app/expenses', // Cambia por tu URL de Vercel
    siteName: 'Control de Finanzas',
    images: [
      {
        url: '/og-image.png', // Opcional: crea una imagen para compartir en redes sociales
        width: 1200,
        height: 630,
        alt: 'Control de Finanzas - Dashboard',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Control de Finanzas - Gestiona tu dinero',
    description:
      'Aplicación web para controlar ingresos, gastos y balance financiero',
    images: ['/og-image.png'], // Opcional: misma imagen que OpenGraph
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#000000',
      },
    ],
  },
  manifest: '/site.webmanifest',
  category: 'finance',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
