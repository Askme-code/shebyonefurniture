'use client';
import { useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Minus, Plus, ShoppingBag } from 'lucide-react';

export function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (quantity > 0) {
      addItem(product, quantity);
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} added.`,
      });
    }
  };

  const increment = () => setQuantity(prev => Math.min(prev + 1, product.stock));
  const decrement = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="flex gap-4">
      <div className="flex items-center border rounded-md">
        <Button variant="ghost" size="icon" onClick={decrement} className="h-12 w-12 rounded-r-none">
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={quantity}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (val > 0 && val <= product.stock) setQuantity(val);
            else if (e.target.value === "") setQuantity(1);
          }}
          className="w-16 h-12 text-center border-x-1 border-y-0 rounded-none focus-visible:ring-0"
        />
        <Button variant="ghost" size="icon" onClick={increment} className="h-12 w-12 rounded-l-none">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button 
        size="lg" 
        onClick={handleAddToCart} 
        disabled={product.stock === 0}
        className="flex-1"
      >
        <ShoppingBag className="mr-2 h-5 w-5" />
        Add to Cart
      </Button>
    </div>
  );
}
