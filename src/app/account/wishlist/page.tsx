'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Heart } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Wishlist</CardTitle>
        <CardDescription>
          Products you've saved for later.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-6 text-xl font-semibold">Wishlist is Empty</h2>
            <p className="mt-2 text-muted-foreground">You haven't saved any items to your wishlist yet.</p>
             <Button asChild className="mt-6">
                <Link href="/products">Explore Products</Link>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
