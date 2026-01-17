'use client';
import { AppLayout } from '@/components/layout/AppLayout';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Palmtree, Target, Eye } from 'lucide-react';
import Image from 'next/image';

const aboutImage = PlaceHolderImages.find(p => p.id === 'hero-1');

export default function AboutPage() {
    
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline tracking-tight">Our Story</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            From humble beginnings in a small Zanzibar workshop, Sheby One Furniture has grown into a beacon of quality and craftsmanship.
          </p>
        </header>

        {aboutImage && (
            <div className="relative h-96 w-full rounded-lg overflow-hidden mb-12 shadow-lg">
                <Image
                    src={aboutImage.imageUrl}
                    alt="Sheby One Furniture workshop"
                    fill
                    className="object-cover"
                    data-ai-hint={aboutImage.imageHint}
                />
            </div>
        )}

        <div className="grid md:grid-cols-2 gap-12 text-lg leading-relaxed">
            <div className="prose prose-lg max-w-none">
                <h2 className="font-headline text-3xl">Rooted in Tradition</h2>
                <p>
                    Sheby One Furniture was born from a passion for preserving the rich heritage of Zanzibari craftsmanship. Our founder, Shaaban, started by learning from local masters, honing his skills in traditional woodworking techniques passed down through generations. The essence of our brand is a tribute to the island's culture, blending timeless artistry with contemporary designs.
                </p>
                <p>
                    Every piece of furniture we create tells a story. We use locally sourced, sustainable materials like Mninga, Mvule, and reclaimed Dhow wood, ensuring that each item is not only beautiful but also environmentally conscious. Our workshop is a place of creativity and collaboration, where artisans pour their heart and soul into their work.
                </p>
            </div>
             <div className="prose prose-lg max-w-none">
                <h2 className="font-headline text-3xl">Crafting the Future</h2>
                <p>
                    Today, Sheby One Furniture stands for more than just furniture. We stand for community, sustainability, and the celebration of local talent. We are committed to providing our customers with pieces that are not just functional but are heirlooms in the making—furniture that brings warmth, character, and a piece of Zanzibar into every home.
                </p>
                 <p>
                    We believe in creating connections, not just transactions. That's why we welcome custom orders and love working with our clients to bring their unique visions to life. Thank you for being a part of our journey.
                </p>
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-center mt-16 pt-12 border-t">
            <div className="flex flex-col items-center">
                <Palmtree className="h-12 w-12 text-primary mb-4" />
                <h3 className="font-headline text-2xl">Our Heritage</h3>
                <p className="text-muted-foreground">Inspired by the rich culture and natural beauty of Zanzibar.</p>
            </div>
            <div className="flex flex-col items-center">
                <Target className="h-12 w-12 text-primary mb-4" />
                <h3 className="font-headline text-2xl">Our Mission</h3>
                <p className="text-muted-foreground">To craft high-quality, sustainable furniture that tells a story.</p>
            </div>
             <div className="flex flex-col items-center">
                <Eye className="h-12 w-12 text-primary mb-4" />
                <h3 className="font-headline text-2xl">Our Vision</h3>
                <p className="text-muted-foreground">To be a leading name in bespoke furniture, globally recognized for Zanzibari excellence.</p>
            </div>
        </div>

      </div>
    </AppLayout>
  );
}
