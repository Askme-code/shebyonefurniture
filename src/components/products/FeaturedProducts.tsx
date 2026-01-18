'use client';
import { useProducts } from '@/hooks/use-products';
import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

export function FeaturedProducts() {
  const { products, isLoading } = useProducts();
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);

  if (isLoading) {
      return (
          <section className="py-16 sm:py-24">
              <div className="container mx-auto px-4">
                  <div className="text-center mb-12">
                      <h2 className="text-3xl font-headline tracking-tight sm:text-4xl">Featured Products</h2>
                      <p className="mt-4 text-lg text-muted-foreground">Our best-sellers and customer favorites.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                      {[...Array(4)].map((_, i) => (
                           <div key={i} className="space-y-2">
                               <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                               <Skeleton className="h-6 w-3/4" />
                               <Skeleton className="h-8 w-1/2" />
                           </div>
                      ))}
                  </div>
              </div>
          </section>
      )
  }

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-headline tracking-tight sm:text-4xl">Featured Products</h2>
          <p className="mt-4 text-lg text-muted-foreground">Our best-sellers and customer favorites.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
