
'use client';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
  const newPrice = hasDiscount
      ? product.price * (1 - product.discountPercentage! / 100)
      : product.price;

  return (
    <Card className="w-full overflow-hidden group transition-shadow duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`}>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={product.images[0].hint}
            />
            {hasDiscount && (
                <Badge className="absolute top-2 right-2 z-10 bg-destructive text-destructive-foreground">
                    -{product.discountPercentage}%
                </Badge>
            )}
            {product.deliveryInfo && (
                <Badge variant="secondary" className="absolute top-2 left-2 z-10">
                    {product.deliveryInfo}
                </Badge>
            )}
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <CardTitle className="text-lg font-body font-bold tracking-normal line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
        </Link>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
         <div className="flex flex-col">
            {hasDiscount ? (
                <>
                    <p className="text-lg font-bold text-primary">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TZS' }).format(newPrice)}
                    </p>
                    <p className="text-sm text-muted-foreground line-through">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TZS' }).format(product.price)}
                    </p>
                </>
            ) : (
                <p className="text-lg font-bold text-primary">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TZS' }).format(product.price)}
                </p>
            )}
        </div>
        <Button size="icon" variant="outline" onClick={handleAddToCart} aria-label={`Add ${product.name} to cart`}>
          <ShoppingBag className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
