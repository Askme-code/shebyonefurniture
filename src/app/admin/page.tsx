'use client';

import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Package,
} from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAllOrders } from '@/hooks/use-all-orders';
import { useProducts } from '@/hooks/use-products';


export default function Dashboard() {
    const { orders, isLoading: isLoadingOrders } = useAllOrders();
    const { products, isLoading: isLoadingProducts } = useProducts();

    const totalRevenue = orders.reduce((sum, order) => order.status === 'Delivered' ? sum + order.total : sum, 0);
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const totalProducts = products.length;
    const outOfStock = products.filter(p => p.stock === 0).length;

    if (isLoadingOrders || isLoadingProducts) {
       return (
        <div className="flex items-center justify-center h-full">
            <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                <span>Loading dashboard data...</span>
            </div>
        </div>
       )
    }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on delivered orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting processing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Total products in catalog
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStock}</div>
            <p className="text-xs text-muted-foreground">
              Products that need restocking
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Recent orders from your store.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/admin/orders">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden xl:table-cell">Status</TableHead>
                  <TableHead className="hidden xl:table-cell">Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.slice(0, 5).map(order => (
                    <TableRow key={order.id}>
                        <TableCell>
                            <div className="font-medium">{order.customerName}</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                            {order.phone}
                            </div>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                            <Badge className="text-xs" variant={order.status === 'Delivered' ? 'default' : order.status === 'Cancelled' ? 'destructive' : order.status === 'Processing' ? 'secondary' : 'outline'}>
                                {order.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell lg:hidden xl:table-cell">
                           {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TZS' }).format(order.total)}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>
            <CardDescription>
              New customers that recently placed an order.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8">
            {orders.slice(0,5).map(order => (
                <div key={order.id} className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src="/avatars/01.png" alt="Avatar" />
                    <AvatarFallback>{order.customerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">{order.customerName}</p>
                    <p className="text-sm text-muted-foreground">{order.phone}</p>
                    </div>
                    <div className="ml-auto font-medium">+{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TZS' }).format(order.total)}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
