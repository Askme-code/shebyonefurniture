'use client';

import { useState, useEffect, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProductCard } from '@/components/products/ProductCard';
import { getCategories } from '@/lib/data';
import { useProducts } from '@/hooks/use-products';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ListFilter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsPage() {
  const { products: allProducts, isLoading } = useProducts();
  const allCategories = [{ id: 'all', name: 'All' }, ...getCategories()];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const maxPrice = useMemo(() => {
    if (allProducts.length === 0) return 5000000;
    return Math.max(...allProducts.map(p => p.price));
  }, [allProducts]);

  const [priceRange, setPriceRange] = useState([0, maxPrice]);

  useEffect(() => {
      setPriceRange([0, maxPrice]);
  }, [maxPrice]);


  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesCategory && matchesSearch && matchesPrice;
  });

  const mainContent = isLoading ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
             <div key={i} className="space-y-2">
                 <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                 <Skeleton className="h-6 w-3/4" />
                 <Skeleton className="h-8 w-1/2" />
             </div>
        ))}
    </div>
  ) : (
    filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
        ))}
        </div>
    ) : (
        <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <h2 className="text-2xl font-headline">No Products Found</h2>
            <p className="text-muted-foreground mt-2">Try adjusting your filters or search term.</p>
        </div>
    )
  );

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-headline tracking-tight">All Products</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Explore our collection of handcrafted furniture.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="md:col-span-1">
            <div className="sticky top-24 space-y-8">
              <div>
                <h3 className="text-xl font-headline mb-4">Search</h3>
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div>
                <h3 className="text-xl font-headline mb-4">Category</h3>
                <RadioGroup
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  className="space-y-2"
                >
                  {allCategories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={category.id} id={`cat-${category.id}`} />
                      <Label htmlFor={`cat-${category.id}`}>{category.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <h3 className="text-xl font-headline mb-4">Price Range</h3>
                <Slider
                  min={0}
                  max={maxPrice}
                  step={100000}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value)}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>{new Intl.NumberFormat('sw-TZ').format(priceRange[0])} TZS</span>
                  <span>{new Intl.NumberFormat('sw-TZ').format(priceRange[1])} TZS</span>
                </div>
              </div>

              <Button onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setPriceRange([0, maxPrice]);
              }} 
              variant="outline"
              className="w-full"
              >
                <ListFilter className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="md:col-span-3">
            {mainContent}
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
