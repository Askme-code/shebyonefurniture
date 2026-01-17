'use client';

import { useParams, notFound } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProductCard } from '@/components/products/ProductCard';
import { getProducts, getCategoryById } from '@/lib/data';

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;
  
  const category = getCategoryById(categoryId);
  const products = getProducts().filter(p => p.category === categoryId);

  if (!category) {
    // In a real app, you might want to show a loading state
    // while fetching the category.
    if (typeof window !== 'undefined') {
        return notFound();
    }
    return null;
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-headline tracking-tight">{category.name}</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Explore our handcrafted collection of {category.name.toLowerCase()}.
          </p>
        </header>

        <main>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-16 border-2 border-dashed rounded-lg">
              <h2 className="text-2xl font-headline">No Products Yet</h2>
              <p className="text-muted-foreground mt-2">
                There are currently no products in the {category.name} category. Please check back later!
              </p>
            </div>
          )}
        </main>
      </div>
    </AppLayout>
  );
}
