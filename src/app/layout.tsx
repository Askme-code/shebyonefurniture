import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/CartProvider';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Sheby One Furniture',
  description: 'Modern and custom furniture in Zanzibar, Tanzania.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
        <div className="gtranslate_wrapper"></div>
        <Script id="gtranslate-settings" strategy="afterInteractive">
          {`window.gtranslateSettings = {"default_language":"en","languages":["en","fr","it","es","sw","ar"],"wrapper_selector":".gtranslate_wrapper"}`}
        </Script>
        <Script
          src="https://cdn.gtranslate.net/widgets/latest/float.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
