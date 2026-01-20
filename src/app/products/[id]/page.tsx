'use client';

import { useParams, notFound } from 'next/navigation';
import { useProducts } from '@/hooks/use-products';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProductImageGallery } from '@/components/products/ProductImageGallery';
import { AddToCart } from '@/components/cart/AddToCart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Loader2 } from 'lucide-react';
import { Recommendations } from '@/components/products/Recommendations';

export default function ProductPage() {
  const params = useParams();
  const { getProductById, isLoading } = useProducts();
  const product = getProductById(params.id as string);

  if (isLoading) {
      return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="flex h-96 w-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </div>
        </AppLayout>
      );
  }

  if (!product) {
    notFound();
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          <ProductImageGallery images={product.images} />

          <div>
            <h1 className="text-3xl lg:text-4xl font-headline font-bold">{product.name}</h1>
            <p className="text-2xl font-bold text-primary my-4">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TZS' }).format(product.price)}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <div className="my-6 space-y-4">
              {product.materials && (
                <div className="flex items-start gap-4">
                  <span className="font-semibold w-24">Materials:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.materials.map(material => (
                      <Badge key={material} variant="secondary">{material}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {product.sizes && (
                <div className="flex items-start gap-4">
                  <span className="font-semibold w-24">Sizes:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <Badge key={size} variant="secondary">{size}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mb-6">
              {product.stock > 0 ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>In Stock ({product.stock} available)</span>
                </>
              ) : (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                  <Package className="h-5 w-5" />
                  <span>Out of Stock</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <AddToCart product={product} />
                 <Button asChild size="lg" variant="outline">
                    <a href="https://wa.me/255657687266" target="_blank" rel="noopener noreferrer">
                        Order via WhatsApp
                    </a>
                </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Recommendations currentProductId={product.id} />
    </AppLayout>
  );
}
