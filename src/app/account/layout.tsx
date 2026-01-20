'use client';
import { AppLayout } from '@/components/layout/AppLayout';
import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ClipboardList, Heart, User as UserIcon } from 'lucide-react';

function AccountLoadingScreen() {
    return (
        <AppLayout>
            <div className="container flex items-center justify-center h-full py-24">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    <span>Loading account...</span>
                </div>
            </div>
        </AppLayout>
    );
}

const navItems = [
    { href: '/account', label: 'My Dashboard', icon: LayoutDashboard },
    { href: '/account/orders', label: 'My Orders', icon: ClipboardList },
    { href: '/account/wishlist', label: 'My Wishlist', icon: Heart },
    { href: '/account/profile', label: 'My Profile', icon: UserIcon },
];

function AccountNav() {
    const pathname = usePathname();
    return (
        <nav className="flex flex-col gap-2">
            {navItems.map(item => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                        pathname === item.href && 'bg-muted text-primary font-bold'
                    )}
                >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return <AccountLoadingScreen />;
  }

  return (
    <AppLayout>
        <div className="container mx-auto px-4 py-8 md:py-12">
             <div className="grid md:grid-cols-4 gap-8">
                <aside className="md:col-span-1">
                   <AccountNav />
                </aside>
                <main className="md:col-span-3">
                    {children}
                </main>
            </div>
        </div>
    </AppLayout>
  );
}
