'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/use-products';
import { useAdmin } from '@/hooks/use-admin';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Store, Loader2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import type { Product } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

const paymentMethods = ["Cash", "QR", "Mix by Yas", "Lipa", "Bank", "Cheque", "Loan"] as const;

const directSellSchema = z.object({
  productId: z.string().min(1, 'Please select a product.'),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1.'),
  customerName: z.string().optional(),
  amountPaid: z.coerce.number().min(0, "Amount paid can't be negative."),
  paymentMethod: z.enum(paymentMethods),
});

type DirectSellFormValues = z.infer<typeof directSellSchema>;

export default function DirectSellPage() {
    const { products, isLoading: isLoadingProducts, updateProduct } = useProducts();
    const { user: adminUser, isLoading: isLoadingAdmin } = useAdmin();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const form = useForm<DirectSellFormValues>({
        resolver: zodResolver(directSellSchema),
        defaultValues: {
            productId: '',
            quantity: 1,
            customerName: '',
            amountPaid: 0,
            paymentMethod: 'Cash',
        },
    });

    const { watch, setValue } = form;
    const watchedProductId = watch('productId');
    const watchedQuantity = watch('quantity');
    const watchedAmountPaid = watch('amountPaid');

    useEffect(() => {
        if (watchedProductId) {
            const product = products.find(p => p.id === watchedProductId);
            setSelectedProduct(product || null);
            if (product && watchedQuantity > product.stock) {
                setValue('quantity', product.stock);
            }
        } else {
            setSelectedProduct(null);
        }
    }, [watchedProductId, products, watchedQuantity, setValue]);
    
    const total = useMemo(() => {
        if (!selectedProduct) return 0;
        return selectedProduct.price * watchedQuantity;
    }, [selectedProduct, watchedQuantity]);

    const balance = useMemo(() => {
        return total - watchedAmountPaid;
    }, [total, watchedAmountPaid]);

    useEffect(() => {
        if (total > 0) {
            setValue('amountPaid', total);
        }
    }, [total, setValue]);


    const onSubmit = (data: DirectSellFormValues) => {
        if (!firestore || !adminUser) {
            toast({
                title: 'Error',
                description: 'Could not process sale. Admin user not found.',
                variant: 'destructive',
            });
            return;
        }

        const product = products.find(p => p.id === data.productId);
        if (!product) {
             toast({ title: 'Error', description: 'Selected product not found.', variant: 'destructive' });
             return;
        }
        if (data.quantity > product.stock) {
            toast({ title: 'Error', description: `Not enough stock. Only ${product.stock} available.`, variant: 'destructive' });
            return;
        }
        
        const total = product.price * data.quantity;
        const balance = total - data.amountPaid;

        const orderData = {
            customerName: data.customerName || 'In-Store Customer',
            phone: 'N/A',
            address: 'Direct Sale',
            items: [{
                productId: product.id,
                productName: product.name,
                quantity: data.quantity,
                price: product.price,
            }],
            total,
            amountPaid: data.amountPaid,
            balance,
            paymentMethod: data.paymentMethod,
            status: 'Delivered',
            createdAt: serverTimestamp(),
            userId: adminUser.uid,
        };

        const ordersCollection = collection(firestore, 'orders');
        addDocumentNonBlocking(ordersCollection, orderData);

        const updatedProduct = { ...product, stock: product.stock - data.quantity };
        updateProduct(updatedProduct);

        toast({
            title: 'Sale Recorded',
            description: `Sold ${data.quantity} x ${product.name}.`,
        });

        form.reset();
        setSelectedProduct(null);
    };
    
    const isLoading = isLoadingProducts || isLoadingAdmin;

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="flex items-center space-x-2">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span>Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Direct Sale</CardTitle>
                <CardDescription>
                    Record a sale for a customer purchasing directly in-store. This will create an order and update stock levels.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
                        <FormField
                            control={form.control}
                            name="productId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a product to sell" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {products.map(product => (
                                                <SelectItem key={product.id} value={product.id} disabled={product.stock === 0}>
                                                    {product.name} ({product.stock} in stock)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {selectedProduct && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="quantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quantity</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    min="1"
                                                    max={selectedProduct.stock}
                                                    placeholder="1" 
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Total Price</span>
                                        <span className="font-semibold">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TZS' }).format(total)}
                                        </span>
                                    </div>
                                    <Separator />
                                     <FormField
                                        control={form.control}
                                        name="amountPaid"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between">
                                                <FormLabel>Amount Paid</FormLabel>
                                                <FormControl>
                                                    <Input type="number" className="w-40 text-right" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Separator />
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Balance</span>
                                        <span className="font-semibold">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TZS' }).format(balance)}
                                        </span>
                                    </div>
                                </div>
                                <FormMessage>{form.formState.errors.amountPaid?.message}</FormMessage>

                                <FormField
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mode of Payment</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a payment method" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {paymentMethods.map(method => (
                                                        <SelectItem key={method} value={method}>
                                                            {method}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}


                        <FormField
                            control={form.control}
                            name="customerName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Customer Name (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="In-Store Customer" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={!watchedProductId || form.formState.isSubmitting}>
                            <Store className="mr-2 h-4 w-4" />
                            Record Sale
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
