'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-headline mb-8">Your Shopping Cart</h1>
        {items.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
            <h2 className="mt-6 text-xl font-semibold">Your cart is empty</h2>
            <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
            <Button asChild className="mt-6">
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="md:col-span-2 space-y-4">
              {items.map(({ product, quantity }) => (
                <Card key={product.id} className="flex flex-wrap items-center justify-between gap-y-4 p-4">
                  <div className="flex items-center">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        data-ai-hint={product.images[0].hint}
                      />
                    </div>
                    <div className="flex-grow ml-4">
                      <Link href={`/products/${product.id}`} className="font-semibold hover:text-primary">{product.name}</Link>
                      <p className="text-sm text-muted-foreground">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TZS' }).format(product.price)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                     <div className="flex items-center border rounded-md">
                        <Button variant="ghost" size="icon" onClick={() => updateQuantity(product.id, quantity - 1)} className="h-9 w-9">
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                            type="number"
                            value={quantity}
                            readOnly
                            className="w-12 h-9 text-center border-none focus-visible:ring-0"
                        />
                        <Button variant="ghost" size="icon" onClick={() => updateQuantity(product.id, quantity + 1)} className="h-9 w-9">
                          <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(product.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            <div className="md:col-span-1">
                <Card className="sticky top-24">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TZS' }).format(totalPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="text-sm text-muted-foreground">Calculated at checkout</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TZS' }).format(totalPrice)}</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button asChild size="lg" className="w-full">
                            <Link href="/checkout">Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" /></Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}