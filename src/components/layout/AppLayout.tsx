import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { FloatingActionMenu } from './FloatingActionMenu';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <FloatingActionMenu />
    </div>
  );
}
