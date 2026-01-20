'use client';
import { useUser } from '@/firebase';
import { useOrders } from '@/hooks/use-orders';
import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';


export default function AccountDashboardPage() {
    const { user } = useUser();
    const { orders: allOrders, isLoading: areOrdersLoading } = useOrders();
    
    const orders = useMemo(() => {
        return allOrders.slice(0, 5);
    }, [allOrders]);

    if (!user) {
        return null;
    }

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-headline tracking-tight">Dashboard</h1>
                <p className="mt-1 text-muted-foreground">Welcome back, {user.displayName || user.email}! Here's a quick overview of your account.</p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>My Recent Orders</CardTitle>
                    <CardDescription>Showing your last 5 orders. <Link href="/account/orders" className="text-primary hover:underline">View all orders</Link>.</CardDescription>
                </CardHeader>
                <CardContent>
                    {areOrdersLoading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : orders.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={order.status === 'Delivered' ? 'default' : order.status === 'Cancelled' ? 'destructive' : order.status === 'Processing' ? 'secondary' : 'outline'}>
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TZS' }).format(order.total)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-16 border-2 border-dashed rounded-lg">
                            <h2 className="mt-6 text-xl font-semibold">No Orders Found</h2>
                            <p className="mt-2 text-muted-foreground">You haven't placed any orders yet.</p>
                            <Button asChild className="mt-6">
                                <Link href="/products">Start Shopping</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
