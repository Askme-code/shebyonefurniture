import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const galleryImages = [
    { src: '/image/gallery/furniture1.jpg', alt: 'Modern wooden chair' },
    { src: '/image/gallery/sofa-bed.jpeg', alt: 'Comfortable sofa bed' },
    { src: '/image/gallery/office-set-furniture.jpg', alt: 'Complete office furniture set' },
    { src: '/image/gallery/bed-sofa.jpeg', alt: 'Stylish bed and sofa combination' },
    { src: '/image/gallery/for-office.jpg', alt: 'Minimalist office desk' },
    { src: '/image/gallery/shelf.jpeg', alt: 'Wooden display shelf' },
    { src: '/image/gallery/furniture2.jpg', alt: 'Elegant dining chair' },
    { src: '/image/gallery/tv-showcase-table.jpeg', alt: 'Modern TV showcase table' },
    { src: '/image/gallery/sofa_coach.jpeg', alt: 'Plush sofa coach' },
    { src: '/image/gallery/office-furniture.jpg', alt: 'Ergonomic office chair' },
    { src: '/image/gallery/raw-timber.jpg', alt: 'Stack of raw timber' },
    { src: '/image/gallery/office-setup.jpg', alt: 'Professional office setup' },
];

export function ProductGallery() {
    return (
        <section className="py-16 sm:py-24 bg-card">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-headline tracking-tight sm:text-4xl">Product Gallery</h2>
                    <p className="mt-4 text-lg text-muted-foreground">Explore Our Wide Range of Quality Products</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleryImages.map((image, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                            <Image
                                src={image.src}
                                alt={image.alt}
                                width={500}
                                height={500}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                    ))}
                </div>
                 <div className="text-center mt-12">
                    <Button asChild size="lg">
                        <Link href="/contact">Contact Us</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
