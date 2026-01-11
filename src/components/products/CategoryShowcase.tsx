import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/lib/data';

export function CategoryShowcase() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-headline tracking-tight sm:text-4xl">Shop by Category</h2>
          <p className="mt-4 text-lg text-muted-foreground">Find the perfect piece for every room in your home.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link href={`/category/${category.id}`} key={category.id} className="group">
              <div className="aspect-square overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={category.imageHint}
                />
              </div>
              <h3 className="mt-4 text-center font-semibold text-foreground group-hover:text-primary transition-colors">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
