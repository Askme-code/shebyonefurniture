import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { WhatsappButton } from '../ui/WhatsappButton';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <WhatsappButton />
    </div>
  );
}
