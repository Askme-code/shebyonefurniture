import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CategoryShowcase } from '@/components/products/CategoryShowcase';
import { FeaturedProducts } from '@/components/products/FeaturedProducts';
import { AppLayout } from '@/components/layout/AppLayout';
import { ArrowRight } from 'lucide-react';
import { OurServices } from '@/components/layout/OurServices';
import { ProductGallery } from '@/components/layout/ProductGallery';

const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');

export default function Home() {
  return (
    <AppLayout>
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] md:h-[80vh] w-full">
          {heroImage && (
             <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-bold mb-4 drop-shadow-lg">
                Crafting Comfort for Your Home
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 drop-shadow-md">
                Discover exquisite, handcrafted furniture from the heart of Zanzibar.
              </p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/products">Shop Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <CategoryShowcase />

        {/* Featured Products Section */}
        <FeaturedProducts />

        {/* Our Services Section */}
        <OurServices />

        {/* Product Gallery Section */}
        <ProductGallery />

        {/* Promotion Section */}
        <section className="py-16 sm:py-24 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-headline tracking-tight sm:text-4xl mb-4">Custom Furniture, Uniquely Yours</h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8">
              Have a specific design in mind? We bring your vision to life with our custom furniture services.
            </p>
            <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
              <a href="https://wa.me/255686587266" target="_blank" rel="noopener noreferrer">
                Inquire on WhatsApp
              </a>
            </Button>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
