'use client';
import { useEffect, useState } from 'react';
import { getPersonalizedRecommendations } from '@/ai/flows/personalized-recommendations';
import { useProducts } from '@/hooks/use-products';
import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useCart } from '@/hooks/use-cart';

const VIEWED_PRODUCTS_KEY = 'viewedProductIds';

export function Recommendations({ currentProductId }: { currentProductId: string }) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
  const { items: cartItems } = useCart();
  const { getProductById, products, isLoading: isLoadingProducts } = useProducts();

  useEffect(() => {
    // Add current product to viewed history in localStorage
    const viewedProductIds: string[] = JSON.parse(localStorage.getItem(VIEWED_PRODUCTS_KEY) || '[]');
    if (!viewedProductIds.includes(currentProductId)) {
      const updatedViewed = [currentProductId, ...viewedProductIds].slice(0, 5); // Keep last 5
      localStorage.setItem(VIEWED_PRODUCTS_KEY, JSON.stringify(updatedViewed));
    }
  }, [currentProductId]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (isLoadingProducts) return;

      setIsLoadingRecommendations(true);
      try {
        const viewedProductIds: string[] = JSON.parse(localStorage.getItem(VIEWED_PRODUCTS_KEY) || '[]');
        const cartProductIds = cartItems.map(item => item.product.id);

        const recommendedIds = await getPersonalizedRecommendations({
          viewedProductIds: viewedProductIds,
          cartProductIds: cartProductIds,
        });

        const recommendedProducts = recommendedIds
          .map(id => getProductById(id))
          .filter((p): p is Product => p !== undefined);

        setRecommendations(recommendedProducts);
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
        setRecommendations(products.filter(p => p.isFeatured && p.id !== currentProductId).slice(0, 5));
      } finally {
        setIsLoadingRecommendations(false);
      }
    };

    fetchRecommendations();
  }, [currentProductId, cartItems, getProductById, products, isLoadingProducts]);

  if (isLoadingRecommendations || isLoadingProducts) {
    return (
        <section className="py-16 sm:py-24 bg-card">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-headline tracking-tight mb-8">You Might Also Like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className="aspect-[4/3] bg-muted rounded-lg animate-pulse"></div>
                            <div className="h-6 w-3/4 bg-muted rounded animate-pulse"></div>
                            <div className="h-8 w-1/2 bg-muted rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
      </section>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-card">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-headline tracking-tight mb-8">You Might Also Like</h2>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {recommendations.map((product) => (
              <CarouselItem key={product.id} className="sm:basis-1/2 lg:basis-1/4">
                <div className="p-1">
                  <ProductCard product={product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:flex"/>
          <CarouselNext className="hidden lg:flex"/>
        </Carousel>
      </div>
    </section>
  );
}
