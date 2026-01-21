'use client';
import { useUserOrders } from '@/hooks/use-user-orders';
import type { Order } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';


export default function MyOrdersPage() {
    const { orders, isLoading: areOrdersLoading } = useUserOrders();
    const firestore = useFirestore();
    const { toast } = useToast();

    const handleCancelOrder = (orderId: string) => {
        if (!firestore) return;
        const orderRef = doc(firestore, 'orders', orderId);
        updateDocumentNonBlocking(orderRef, { status: 'Cancelled' });
        toast({
            title: 'Order Cancelled',
            description: 'Your order has been successfully cancelled.',
            variant: 'destructive',
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Orders</CardTitle>
                <CardDescription>Here is a list of all your past orders.</CardDescription>
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
                                <TableHead className="text-right">Actions</TableHead>
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
                                    <TableCell className="text-right">
                                        {order.status === 'Pending' && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="outline" size="sm">Cancel</Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure you want to cancel this order?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Back</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleCancelOrder(order.id)} className="bg-destructive hover:bg-destructive/90">
                                                            Confirm Cancellation
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
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
    )
}
