import { getProducts } from '@/lib/data';
import { ProductCard } from './ProductCard';

export function FeaturedProducts() {
  const featuredProducts = getProducts().filter(p => p.isFeatured).slice(0, 4);

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
