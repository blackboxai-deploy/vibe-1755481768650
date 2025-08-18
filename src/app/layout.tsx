import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './custom.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Currency Exchange Monitor | Real-time Rates & Analytics',
  description: 'Monitor real-time currency exchange rates with interactive charts and analytics. Track 25+ global currencies with live updates every 30 seconds.',
  keywords: 'currency exchange, forex rates, real-time rates, currency converter, exchange rate monitor, forex analytics',
  authors: [{ name: 'Currency Monitor Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Currency Exchange Monitor',
    description: 'Real-time currency exchange rates with interactive charts and analytics',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Currency Exchange Monitor',
    description: 'Real-time currency exchange rates with interactive charts and analytics',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💱</text></svg>" />
        <meta name="theme-color" content="#3B82F6" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}