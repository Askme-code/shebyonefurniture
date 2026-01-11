'use client';
import { useCart } from '@/hooks/use-cart';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const checkoutSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    address: z.string().min(5, "Please enter a valid address"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
        name: "",
        phone: "",
        address: "",
    },
  });

  const onSubmit = (data: CheckoutFormValues) => {
    console.log("Order Submitted:", {
        ...data,
        items,
        total: totalPrice,
    });
    
    // Here you would typically send this data to your backend/Firestore
    
    toast({
      title: "Order Placed!",
      description: "Thank you for your purchase. We will contact you shortly.",
    });

    clearCart();
    router.push('/');
  };
  
  if (items.length === 0 && typeof window !== 'undefined') {
    router.push('/cart');
    return null;
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-headline mb-8">Checkout</h1>
        <div className="grid md:grid-cols-2 gap-12">
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Shipping Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="0777 123 456" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Delivery Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Street, Area, Zanzibar" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" size="lg" className="w-full">
                                    Place Order
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <h2 className="text-2xl font-headline">Order Summary</h2>
                <div className="space-y-4 rounded-lg border p-4">
                    {items.map(({ product, quantity }) => (
                        <div key={product.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                     <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                                     <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{quantity}</span>
                                </div>
                                <div>
                                    <p className="font-semibold">{product.name}</p>
                                    <p className="text-sm text-muted-foreground">Qty: {quantity}</p>
                                </div>
                            </div>
                            <p className="font-semibold">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TZS' }).format(product.price * quantity)}
                            </p>
                        </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                        <p>Total</p>
                        <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TZS' }).format(totalPrice)}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </AppLayout>
  );
}
