
'use client';

import { Button } from '@/components/ui/button';
import {
  Home,
  Package,
  ClipboardList,
  Users,
  MessageSquare,
  Star,
  BarChart,
  ShoppingCart,
  Settings,
  PanelLeft,
  Mail,
} from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { OrderProvider } from '@/context/OrderProvider';
import { useAdmin } from '@/hooks/use-admin';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

function AdminLoadingScreen({ message }: { message: string }) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-2 text-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, isLoading } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    // This effect handles redirection after the loading state is resolved.
    if (!isLoading) {
      if (pathname === '/admin/login') {
        if (isAdmin) {
          router.push('/admin');
        }
      } else {
        if (!isAdmin) {
          if (user) {
            toast({
              title: 'Access Denied',
              description: 'You do not have permission to access the admin dashboard.',
              variant: 'destructive',
            });
            router.push('/account');
          } else {
            router.push('/admin/login');
          }
        }
      }
    }
  }, [user, isAdmin, isLoading, router, pathname, toast]);

  // Allow access to the login page without any guards.
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // While checking for admin status, show a loading indicator.
  // This prevents the admin dashboard from ever rendering for a non-admin.
  if (isLoading) {
    return <AdminLoadingScreen message="Verifying Access..." />;
  }

  // If we reach this point, but the user is still not an admin for any reason,
  // we render nothing to prevent a flash of the admin UI.
  if (!isAdmin) {
    return null;
  }

  // If we reach this point, the user is a confirmed admin.
  return (
    <OrderProvider>
      <TooltipProvider>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
              <Link
                href="/"
                className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
              >
                <Image
                  src="/image/sheby-logo.png"
                  alt="Sheby One Furniture"
                  width={20}
                  height={20}
                  className="object-contain"
                />
                <span className="sr-only">Sheby One Furniture</span>
              </Link>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/admin"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  >
                    <Home className="h-5 w-5" />
                    <span className="sr-only">Dashboard</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Dashboard</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/admin/orders"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  >
                    <ClipboardList className="h-5 w-5" />
                    <span className="sr-only">Orders</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Orders</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/admin/products"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  >
                    <Package className="h-5 w-5" />
                    <span className="sr-only">Products</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Products</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/admin/users"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  >
                    <Users className="h-5 w-5" />
                    <span className="sr-only">User Management</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">User Management</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/admin/subscribers"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  >
                    <Mail className="h-5 w-5" />
                    <span className="sr-only">Subscribers</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Subscribers</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/admin/carts"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span className="sr-only">Cart Management</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Cart Management</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/admin/messages"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span className="sr-only">Message Management</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Message Management</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/admin/reviews"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  >
                    <Star className="h-5 w-5" />
                    <span className="sr-only">Review Management</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Review Management</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/admin/reports"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  >
                    <BarChart className="h-5 w-5" />
                    <span className="sr-only">Reports & Analytics</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Reports & Analytics</TooltipContent>
              </Tooltip>
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  >
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Settings</TooltipContent>
              </Tooltip>
            </nav>
          </aside>
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="icon" variant="outline" className="sm:hidden">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs">
                  <nav className="grid gap-6 text-lg font-medium">
                    <Link
                      href="/"
                      className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                    >
                      <Image
                        src="/image/sheby-logo.png"
                        alt="Sheby One Furniture"
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                      <span className="sr-only">Sheby One Furniture</span>
                    </Link>
                    <Link
                      href="/admin"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <Home className="h-5 w-5" />
                      Dashboard
                    </Link>
                    <Link
                      href="/admin/orders"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <ClipboardList className="h-5 w-5" />
                      Orders
                    </Link>
                    <Link
                      href="/admin/products"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <Package className="h-5 w-5" />
                      Products
                    </Link>
                    <Link
                      href="/admin/users"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <Users className="h-5 w-5" />
                      User Management
                    </Link>
                    <Link
                      href="/admin/subscribers"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <Mail className="h-5 w-5" />
                      Subscribers
                    </Link>
                    <Link
                      href="/admin/carts"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Cart Management
                    </Link>
                    <Link
                      href="/admin/messages"
                      className="flex items-center gap-4 px-2.5 text-foreground"
                    >
                      <MessageSquare className="h-5 w-5" />
                      Message Management
                    </Link>
                    <Link
                      href="/admin/reviews"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <Star className="h-5 w-5" />
                      Review Management
                    </Link>
                    <Link
                      href="/admin/reports"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <BarChart className="h-5 w-5" />
                      Reports & Analytics
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </header>
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
              {children}
            </main>
          </div>
        </div>
      </TooltipProvider>
    </OrderProvider>
  );
}
