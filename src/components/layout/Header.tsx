'use client';
import Link from 'next/link';
import { Search, ShoppingBag, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from './Logo';
import { useCart } from '@/hooks/use-cart';
import { categories } from '@/lib/data';

export function Header() {
  const { items } = useCart();
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'All Products' },
    ...categories.map(c => ({ href: `/category/${c.id}`, label: c.name })),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/products" className="transition-colors hover:text-primary">
              All Products
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
            <Button variant="ghost" size="icon" className="hidden md:inline-flex">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
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
          </div>
        </div>
      </div>
    </header>
  );
}
