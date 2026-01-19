'use client';
import Link from 'next/link';
import { Search, ShoppingBag, Menu, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from './Logo';
import { useCart } from '@/hooks/use-cart';
import { categories } from '@/lib/data';
import { useEffect, useState } from 'react';
import { useAuth } from '@/firebase';
import { useAdmin } from '@/hooks/use-admin';
import { signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';


export function Header() {
  const { items } = useCart();
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { user, isAdmin, isLoading } = useAdmin();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    if (!auth) return;
    signOut(auth);
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'All Products' },
    ...categories.map(c => ({ href: `/category/${c.id}`, label: c.name })),
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="font-headline font-bold text-xl">Sheby Furniture</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/products" className="transition-colors hover:text-primary">
              All Products
            </Link>
            <Link href="/about" className="transition-colors hover:text-primary">
              About Us
            </Link>
            <Link href="/contact" className="transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="hidden sm:flex flex-1 max-w-xs items-center">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search furniture..."
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                      <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin ? (
                     <DropdownMenuItem onClick={() => router.push('/admin')}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                     </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => router.push('/account')}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>My Account</span>
                    </DropdownMenuItem>
                  )}
                   <DropdownMenuItem onClick={() => router.push('/account')}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
            )}
            
            <Link href="/cart" passHref>
              <Button variant="ghost" size="icon" asChild>
                <div className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {cartItemCount}
                    </span>
                  )}
                  <span className="sr-only">Shopping Cart</span>
                </div>
              </Button>
            </Link>

            {mounted ? (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium mt-8">
                      {navLinks.map(link => (
                         <Link key={link.href} href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                            {link.label}
                         </Link>
                      ))}
                    </nav>
                  </SheetContent>
                </Sheet>
              ) : (
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
              )
            }
          </div>
        </div>
      </div>
    </header>
  );
}
