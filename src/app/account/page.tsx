'use client';
import { AppLayout } from '@/components/layout/AppLayout';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, Timestamp } from 'firebase/firestore';
import type { Order } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type OrderWithDate = Omit<Order, 'createdAt'> & { createdAt: Date };


export default function AccountPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [user, isUserLoading, router]);
    
    const userOrdersQuery = useMemoFirebase(
        () => (firestore && user ? query(
            collection(firestore, 'orders'),
            where('userId', '==', user.uid)
        ) : null),
        [firestore, user]
    );

    const { data: rawOrders, isLoading: areOrdersLoading } = useCollection<Omit<Order, 'createdAt'> & { createdAt: Timestamp }>(userOrdersQuery);

    const orders = useMemo(() => {
        if (!rawOrders) return [];
        return rawOrders.map(o => ({
            ...o,
            createdAt: o.createdAt?.toDate() ?? new Date(),
        })).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }, [rawOrders]);

    if (isUserLoading || areOrdersLoading) {
        return (
            <AppLayout>
                <div className="container flex items-center justify-center h-full py-24">
                    <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        <span>Loading account details...</span>
                    </div>
                </div>
            </AppLayout>
        );
    }
    
    if (!user) {
        return null; // Redirect is handling this
    }

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8 md:py-12">
                <header className="mb-8">
                    <h1 className="text-4xl font-headline tracking-tight">My Account</h1>
                    <p className="mt-2 text-lg text-muted-foreground">Welcome back, {user.displayName || user.email}!</p>
                </header>

                <Card>
                    <CardHeader>
                        <CardTitle>My Recent Orders</CardTitle>
                        <CardDescription>Here is a list of your recent orders.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {orders.length > 0 ? (
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
        </AppLayout>
    )
}
